import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User.js';
import { registerService, loginService } from '../../src/services/authService.js';

describe('AuthService', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    describe('registerService', () => {
        test('deve registrar usuário corretamente e gerar token', async () => {
            const validatedData = { name: 'Guilherme', email: 'guilherme@test.com', password: '123456' };
            const mockUser = { _id: 'user123', ...validatedData };

            jest.spyOn(User, 'findOne').mockResolvedValue(null);

            jest.spyOn(User, 'create').mockResolvedValue(mockUser);

            jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token');

            const result = await registerService(validatedData);

            expect(User.findOne).toHaveBeenCalledWith({ email: validatedData.email });
            expect(User.create).toHaveBeenCalledWith(validatedData);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'user123' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            expect(result).toEqual({
                user: { id: 'user123', name: 'Guilherme', email: 'guilherme@test.com' },
                token: 'mocked-token'
            });
        });

        test('deve lançar erro se email já existe', async () => {
            const validatedData = { email: 'exist@test.com', password: '123456' };
            const existingUser = { _id: 'user001', ...validatedData };

            jest.spyOn(User, 'findOne').mockResolvedValue(existingUser);

            await expect(registerService(validatedData)).rejects.toThrow('EMAIL_ALREADY_EXISTS');
            expect(User.findOne).toHaveBeenCalledWith({ email: validatedData.email });
        });
    });

    describe('loginService', () => {
        test('deve logar usuário corretamente e gerar token', async () => {
            const loginData = { email: 'guilherme@test.com', password: '123456' };
            const mockUser = {
                _id: 'user123',
                name: 'Guilherme',
                email: 'guilherme@test.com',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(jwt, 'sign').mockReturnValue('mocked-token');

            const result = await loginService(loginData);

            expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
            expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'user123' },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            expect(result).toEqual({
                user: { id: 'user123', name: 'Guilherme', email: 'guilherme@test.com' },
                token: 'mocked-token'
            });
        });

        test('deve lançar erro se usuário não existir', async () => {
            const loginData = { email: 'notfound@test.com', password: '123456' };

            jest.spyOn(User, 'findOne').mockResolvedValue(null);

            await expect(loginService(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
            expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
        });

        test('deve lançar erro se senha estiver incorreta', async () => {
            const loginData = { email: 'guilherme@test.com', password: 'wrongpass' };
            const mockUser = {
                _id: 'user123',
                name: 'Guilherme',
                email: 'guilherme@test.com',
                comparePassword: jest.fn().mockResolvedValue(false)
            };

            jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);

            await expect(loginService(loginData)).rejects.toThrow('INVALID_CREDENTIALS');
            expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
        });
    });
});
