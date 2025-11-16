// transactionService.test.js
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import Account from '../../src/models/Account.js';
import Transaction from '../../src/models/Transaction.js';
import {
    transferService,
    depositService,
} from '../../src/services/transactionService.js';

describe('TransactionService', () => {
    let sessionMock;

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();

        sessionMock = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn()
        };
        jest.spyOn(mongoose, 'startSession').mockResolvedValue(sessionMock);
    });

    describe('transferService', () => {
        const userId = new mongoose.Types.ObjectId();

        test('deve realizar transferência com sucesso', async () => {
            const fromId = new mongoose.Types.ObjectId();
            const toId = new mongoose.Types.ObjectId();

            const fromAccount = {
                _id: fromId,
                user: { equals: jest.fn(() => true) },
                balance: 1000,
                save: jest.fn()
            };
            const toAccount = {
                _id: toId,
                balance: 500,
                save: jest.fn()
            };
            const transactionMock = { _id: 'tx1', amount: 200 };

            jest.spyOn(Account, 'findById')
                .mockResolvedValueOnce(fromAccount)
                .mockResolvedValueOnce(toAccount);

            jest.spyOn(Transaction, 'create').mockResolvedValue([transactionMock]);

            const result = await transferService({
                from: fromId.toString(),
                to: toId.toString(),
                amount: 200,
                description: 'Transfer Test',
                userId
            });

            expect(result).toEqual(transactionMock);
            expect(fromAccount.balance).toBe(800);
            expect(toAccount.balance).toBe(700);
            expect(fromAccount.save).toHaveBeenCalledWith({ session: sessionMock });
            expect(toAccount.save).toHaveBeenCalledWith({ session: sessionMock });
            expect(sessionMock.commitTransaction).toHaveBeenCalled();
            expect(sessionMock.endSession).toHaveBeenCalled();
        });

        test('deve lançar erro se dados inválidos', async () => {
            await expect(transferService({})).rejects.toThrow('INVALID_TRANSFER_DATA');
        });

        test('deve lançar erro se fromAccount não encontrado', async () => {
            jest.spyOn(Account, 'findById').mockResolvedValueOnce(null);

            await expect(
                transferService({ from: '1', to: '2', amount: 100, userId })
            ).rejects.toThrow('FROM_ACCOUNT_NOT_FOUND');
        });

        test('deve lançar erro se não for dono da conta', async () => {
            const fromAccount = {
                _id: new mongoose.Types.ObjectId(),
                user: { equals: () => false },
                balance: 100,
                save: jest.fn()
            };
            jest.spyOn(Account, 'findById').mockResolvedValueOnce(fromAccount);

            await expect(
                transferService({ from: fromAccount._id.toString(), to: '2', amount: 50, userId })
            ).rejects.toThrow('NOT_OWNER');
        });

        test('deve lançar erro se saldo insuficiente', async () => {
            const fromId = new mongoose.Types.ObjectId();
            const toId = new mongoose.Types.ObjectId();

            const fromAccount = {
                _id: fromId,
                user: { equals: jest.fn(() => true) },
                balance: 50,
                save: jest.fn()
            };
            const toAccount = {
                _id: toId,
                balance: 0,
                save: jest.fn()
            };

            jest.spyOn(Account, 'findById')
                .mockResolvedValueOnce(fromAccount)
                .mockResolvedValueOnce(toAccount);

            await expect(
                transferService({ from: fromId.toString(), to: toId.toString(), amount: 100, userId })
            ).rejects.toThrow('INSUFFICIENT_BALANCE');
        });

        test('deve lançar erro se tentar transferir para a mesma conta', async () => {
            const id = new mongoose.Types.ObjectId();
            const fromAccount = {
                _id: id,
                user: { equals: jest.fn(() => true) },
                balance: 100,
                save: jest.fn()
            };
            const toAccount = { _id: id, balance: 50, save: jest.fn() };

            jest.spyOn(Account, 'findById')
                .mockResolvedValueOnce(fromAccount)
                .mockResolvedValueOnce(toAccount);

            await expect(
                transferService({ from: id.toString(), to: id.toString(), amount: 10, userId })
            ).rejects.toThrow('SAME_ACCOUNT_TRANSFER');
        });

        test('deve lançar erro se toAccount não encontrado', async () => {
            const fromAccount = {
                _id: new mongoose.Types.ObjectId(),
                user: { equals: jest.fn(() => true) },
                balance: 100,
                save: jest.fn()
            };
            jest.spyOn(Account, 'findById')
                .mockResolvedValueOnce(fromAccount)
                .mockResolvedValueOnce(null);

            await expect(
                transferService({ from: fromAccount._id.toString(), to: '2', amount: 10, userId })
            ).rejects.toThrow('TO_ACCOUNT_NOT_FOUND');
        });
    });

    describe('depositService', () => {
        const userId = new mongoose.Types.ObjectId();

        test('deve realizar depósito com sucesso', async () => {
            const account = {
                _id: new mongoose.Types.ObjectId(),
                user: { equals: jest.fn(() => true) },
                balance: 100,
                save: jest.fn()
            };
            const transactionMock = { _id: 'tx1', amount: 50 };

            jest.spyOn(Account, 'findById').mockResolvedValue(account);
            jest.spyOn(Transaction, 'create').mockResolvedValue([transactionMock]);

            const result = await depositService({
                accountId: account._id.toString(),
                amount: 50,
                description: 'Deposit Test',
                userId
            });

            expect(result).toEqual(transactionMock);
            expect(account.balance).toBe(150);
            expect(account.save).toHaveBeenCalledWith({ session: sessionMock });
            expect(sessionMock.commitTransaction).toHaveBeenCalled();
            expect(sessionMock.endSession).toHaveBeenCalled();
        });

        test('deve lançar erro se conta não existir', async () => {
            jest.spyOn(Account, 'findById').mockResolvedValue(null);

            await expect(
                depositService({ accountId: new mongoose.Types.ObjectId().toString(), amount: 50, userId })
            ).rejects.toThrow('ACCOUNT_NOT_FOUND');
        });

        test('deve lançar erro se não for dono da conta', async () => {
            const account = {
                _id: new mongoose.Types.ObjectId(),
                user: { equals: jest.fn(() => false) },
                balance: 100,
                save: jest.fn()
            };
            jest.spyOn(Account, 'findById').mockResolvedValue(account);

            await expect(
                depositService({ accountId: account._id.toString(), amount: 50, userId })
            ).rejects.toThrow('NOT_OWNER');
        });

        test('deve lançar erro se valor inválido', async () => {
            await expect(
                depositService({ accountId: new mongoose.Types.ObjectId().toString(), amount: 0, userId })
            ).rejects.toThrow('INVALID_DEPOSIT');
        });
    });
});
