import { jest } from '@jest/globals';
import User from '../../src/models/User.js';
import { getProfile, listUsers } from '../../src/services/userService.js';

describe('UserService', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        test('deve retornar perfil do usuário corretamente', async () => {
            const mockUser = { _id: 'user123', name: 'Guilherme', email: 'guilherme@test.com' };
            const profile = await getProfile(mockUser);

            expect(profile).toEqual({
                id: 'user123',
                name: 'Guilherme',
                email: 'guilherme@test.com'
            });
        });
    });

    describe('listUsers', () => {
        test('deve retornar lista de usuários sem senha', async () => {
            const mockUsers = [
                { _id: '1', name: 'User1', email: 'user1@test.com', password: '123' },
                { _id: '2', name: 'User2', email: 'user2@test.com', password: '456' }
            ];

            const selectMock = jest.fn().mockResolvedValue(
                mockUsers.map(u => ({ _id: u._id, name: u.name, email: u.email }))
            );

            jest.spyOn(User, 'find').mockImplementation(() => ({ select: selectMock }));

            const users = await listUsers();

            expect(User.find).toHaveBeenCalled();
            expect(selectMock).toHaveBeenCalledWith('-password');
            expect(users).toEqual([
                { _id: '1', name: 'User1', email: 'user1@test.com' },
                { _id: '2', name: 'User2', email: 'user2@test.com' }
            ]);
        });

        test('deve lançar erro se find falhar', async () => {
            const selectMock = jest.fn().mockRejectedValue(new Error('DB fail'));
            jest.spyOn(User, 'find').mockImplementation(() => ({ select: selectMock }));

            await expect(listUsers()).rejects.toThrow('DB fail');
        });
    });
});
