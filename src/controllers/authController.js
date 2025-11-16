import { registerSchema, loginSchema } from '../utils/validators.js';
import { registerService, loginService } from '../services/authService.js';

export const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const result = await registerService(value);

    return res.status(201).json(result);
  } catch (err) {
    if (err.message === 'EMAIL_ALREADY_EXISTS') {
      return res.status(409).json({ message: 'Email already registered' });
    }

    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const result = await loginService(value);

    return res.json(result);
  } catch (err) {
    if (err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
