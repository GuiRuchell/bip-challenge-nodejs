import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

export const transferService = async ({ from, to, amount, description, userId }) => {
  if (!from || !to || !amount || amount <= 0) {
    throw new Error('INVALID_TRANSFER_DATA');
  }

  const fromAccount = await Account.findById(from);
  if (!fromAccount) throw new Error('FROM_ACCOUNT_NOT_FOUND');
  if (!fromAccount.user.equals(userId)) throw new Error('NOT_OWNER');

  const toAccount = await Account.findById(to);
  if (!toAccount) throw new Error('TO_ACCOUNT_NOT_FOUND');

  if (fromAccount._id.equals(toAccount._id)) {
    throw new Error('SAME_ACCOUNT_TRANSFER');
  }

  if (fromAccount.balance < amount) {
    throw new Error('INSUFFICIENT_BALANCE');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    const [transaction] = await Transaction.create(
      [{
        from,
        to,
        amount,
        description,
        type: 'transfer',
        user: userId
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return transaction;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const depositService = async ({ accountId, amount, description, userId }) => {
  if (!accountId || !amount || amount <= 0) {
    throw new Error('INVALID_DEPOSIT');
  }

  const account = await Account.findById(accountId);
  if (!account) throw new Error('ACCOUNT_NOT_FOUND');

  if (!account.user.equals(userId)) {
    throw new Error('NOT_OWNER');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    account.balance += Number(amount);
    await account.save({ session });

    const [transaction] = await Transaction.create(
      [{
        account: accountId,
        type: 'deposit',
        amount,
        description,
        user: userId
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return transaction;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const listTransactionsService = async ({ accountId, userId }) => {
  const match = {};

  if (accountId) {
    const objId = new mongoose.Types.ObjectId(accountId);
    match.$or = [
      { from: objId },
      { to: objId },
      { account: objId }
    ];
  } else {
    const accounts = await Account.find({ user: userId }).select('_id');
    const ids = accounts.map(a => a._id);

    match.$or = [
      { from: { $in: ids } },
      { to: { $in: ids } },
      { account: { $in: ids } }
    ];
  }

  const transactions = await Transaction.find(match)
    .sort({ createdAt: -1 })
    .populate('from to account');

  return transactions;
};
