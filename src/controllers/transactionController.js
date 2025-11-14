import {
  transferService,
  depositService,
  listTransactionsService
} from '../services/transactionService.js';

export const transfer = async (req, res) => {
  try {
    const transaction = await transferService({
      from: req.body.from,
      to: req.body.to,
      amount: req.body.amount,
      description: req.body.description,
      userId: req.user._id
    });

    return res.status(201).json(transaction);
  } catch (err) {
    switch (err.message) {
      case 'INVALID_TRANSFER_DATA':
        return res.status(400).json({ message: 'Invalid transfer data' });
      case 'FROM_ACCOUNT_NOT_FOUND':
        return res.status(404).json({ message: 'Source account not found' });
      case 'TO_ACCOUNT_NOT_FOUND':
        return res.status(404).json({ message: 'Target account not found' });
      case 'NOT_OWNER':
        return res.status(403).json({ message: 'You do not own this account' });
      case 'SAME_ACCOUNT_TRANSFER':
        return res.status(400).json({ message: 'Cannot transfer to same account' });
      case 'INSUFFICIENT_BALANCE':
        return res.status(400).json({ message: 'Insufficient balance' });
      default:
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const deposit = async (req, res) => {
  try {
    const transaction = await depositService({
      accountId: req.body.accountId,
      amount: req.body.amount,
      description: req.body.description,
      userId: req.user._id
    });

    return res.status(201).json(transaction);
  } catch (err) {
    switch (err.message) {
      case 'INVALID_DEPOSIT':
        return res.status(400).json({ message: 'Invalid deposit data' });
      case 'ACCOUNT_NOT_FOUND':
        return res.status(404).json({ message: 'Account not found' });
      case 'NOT_OWNER':
        return res.status(403).json({ message: 'You do not own this account' });
      default:
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const listTransactions = async (req, res) => {
  try {
    const transactions = await listTransactionsService({
      accountId: req.query.accountId,
      userId: req.user._id
    });

    return res.json(transactions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
