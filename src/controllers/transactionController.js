import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

export async function transfer(req, res) {
  const { from, to, amount, description } = req.body;
  if (!from || !to || !amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer data' });
  }

  const fromAccount = await Account.findById(from);
  if (!fromAccount) return res.status(404).json({ message: 'From account not found' });

  if (!account.user.equals(req.user._id)) {
    return res.status(403).json({ message: 'You do not own the source account' });
  }

  const toAccount = await Account.findById(to);
  if (!toAccount) return res.status(404).json({ message: 'To account not found' });

  if (fromAccount._id.equals(toAccount._id)) {
    return res.status(400).json({ message: 'Cannot transfer to same account' });
  }

  if (fromAccount.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save({ session });
    await toAccount.save({ session });

    const tx = await Transaction.create(
      [{ from, to, amount, description, type: 'transfer', user: req.user._id }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(tx[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: err.message });
  }
}

export async function deposit(req, res) {
  const { accountId, amount, description } = req.body;

  if (!accountId || !amount || amount <= 0) {
    return res.status(400).json({ message: 'accountId and positive amount are required' });
  }

  const account = await Account.findById(accountId);
  if (!account) return res.status(404).json({ message: 'Account not found' });

  if (account.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You do not own this account' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    account.balance += Number(amount);
    await account.save({ session });

    const transaction = await Transaction.create(
      [{
        account: accountId,
        type: 'deposit',
        amount,
        description,
        user: req.user._id
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(transaction[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: err.message });
  }
}

export async function listTransactions(req, res) {
  const { accountId } = req.query;

  const match = {};
  if (accountId) {
    match.$or = [
      { from: mongoose.Types.ObjectId(accountId) },
      { to: mongoose.Types.ObjectId(accountId) },
      { account: mongoose.Types.ObjectId(accountId) }
    ];
  } else {
    const accounts = await Account.find({ user: req.user._id }).select('_id');
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

  return res.json(transactions);
}