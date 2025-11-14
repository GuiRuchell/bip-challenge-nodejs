import { jest } from '@jest/globals';
import { getProfile, listUsers } from '../../src/services/userService.js';
import mongoose from 'mongoose';

jest.mock('../../src/models/User.js', () => ({
    __esModule: true,
    default: {
        find: jest.fn()
    }
}));

describe('UserService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getProfile', () => {
        test('deve retornar perfil do usuário corretamente', async () => {
            const mockUser = { _id: new mongoose.Types.ObjectId(), name: 'Guilherme', email: 'guilherme@test.com' };

            const result = await getProfile(mockUser);

            expect(result).toEqual({
                id: mockUser._id,
                name: mockUser.name,
                email: mockUser.email
            });
        });
    });
});
