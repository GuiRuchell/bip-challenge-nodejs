import Account from '../models/Account.js';

export const createAccount = async (req, res) => {
  try {
    const { type, balance = 0 } = req.body;

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    const userId = req.user._id;

    const account = new Account({
      user: userId,
      type,
      balance
    });

    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOne({ _id: id, user: req.user._id });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};