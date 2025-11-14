import {
  createAccountService,
  getAccountsService,
  getAccountService
} from '../services/accountService.js';

export const createAccount = async (req, res) => {
  try {
    const { type, balance = 0 } = req.body;

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    const userId = req.user._id;

    const account = await createAccountService(userId, type, balance);

    return res.status(201).json(account);
  } catch (error) {
    console.error('CreateAccount Error:', error);
    return res.status(500).json({ message: 'Failed to create account' });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const accounts = await getAccountsService(req.user._id);

    return res.json(accounts);
  } catch (error) {
    console.error('GetAccounts Error:', error);
    return res.status(500).json({ message: 'Failed to fetch accounts' });
  }
};

export const getAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const account = await getAccountService(req.user._id, id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.json(account);
  } catch (error) {
    console.error('GetAccount Error:', error);
    return res.status(500).json({ message: 'Failed to fetch account' });
  }
};
