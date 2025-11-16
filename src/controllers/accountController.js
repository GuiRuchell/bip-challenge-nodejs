import { jest } from '@jest/globals';
import {
  createAccount,
  getAccounts,
  getAccount
} from '../../src/controllers/accountController.js';

import * as accountService from '../../src/services/accountService.js';

jest.mock('../../src/services/accountService.js');

const mockRequest = (data = {}) => ({
  body: {},
  params: {},
  user: { _id: 'user123' },
  ...data
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAccount', () => {
    test('deve retornar 400 se "type" não for enviado', async () => {
      const req = mockRequest({ body: {} });
      const res = mockResponse();

      await createAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Type is required' });
    });

    test('deve criar conta chamando createAccountService', async () => {
      const req = mockRequest({ body: { type: 'checking', balance: 100 } });
      const res = mockResponse();

      const account = { id: 'acc1', type: 'checking', balance: 100 };
      accountService.createAccountService.mockResolvedValue(account);

      await createAccount(req, res);

      expect(accountService.createAccountService).toHaveBeenCalledWith('user123', 'checking', 100);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(account);
    });

    test('deve retornar 500 se createAccountService lançar erro', async () => {
      const req = mockRequest({ body: { type: 'checking', balance: 0 } });
      const res = mockResponse();

      accountService.createAccountService.mockRejectedValue(new Error('DB error'));

      await createAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to create account' });
    });
  });

  describe('getAccounts', () => {
    test('deve retornar lista de contas', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const accounts = [{ id: '1', type: 'checking' }, { id: '2', type: 'savings' }];
      accountService.getAccountsService.mockResolvedValue(accounts);

      await getAccounts(req, res);

      expect(accountService.getAccountsService).toHaveBeenCalledWith('user123');
      expect(res.json).toHaveBeenCalledWith(accounts);
    });

    test('deve retornar 500 se getAccountsService falhar', async () => {
      const req = mockRequest();
      const res = mockResponse();

      accountService.getAccountsService.mockRejectedValue(new Error('DB fail'));

      await getAccounts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch accounts' });
    });
  });

  describe('getAccount', () => {
    test('deve retornar 404 se a conta não for encontrada', async () => {
      const req = mockRequest({ params: { id: 'acc1' } });
      const res = mockResponse();

      accountService.getAccountService.mockResolvedValue(null);

      await getAccount(req, res);

      expect(accountService.getAccountService).toHaveBeenCalledWith('user123', 'acc1');
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Account not found' });
    });

    test('deve retornar dados da conta se encontrada', async () => {
      const req = mockRequest({ params: { id: 'acc1' } });
      const res = mockResponse();

      const account = { id: 'acc1', type: 'checking', balance: 500 };
      accountService.getAccountService.mockResolvedValue(account);

      await getAccount(req, res);

      expect(accountService.getAccountService).toHaveBeenCalledWith('user123', 'acc1');
      expect(res.json).toHaveBeenCalledWith(account);
    });

    test('deve retornar 500 se getAccountService lançar erro', async () => {
      const req = mockRequest({ params: { id: 'acc1' } });
      const res = mockResponse();

      accountService.getAccountService.mockRejectedValue(new Error('DB fail'));

      await getAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch account' });
    });
  });
});
