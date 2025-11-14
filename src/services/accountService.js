import Account from '../models/Account.js';

export const createAccountService = async (userId, type, balance = 0) => {
  const account = new Account({
    user: userId,
    type,
    balance
  });

  return await account.save();
};

export const getAccountsService = async (userId) => {
  return await Account.find({ user: userId });
};

export const getAccountService = async (userId, accountId) => {
  return await Account.findOne({ _id: accountId, user: userId });
};
