import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

export async function register(req, res) {
  const { error, value } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const exists = await User.findOne({ email: value.email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create(value);
  const token = generateToken(user);
  return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email }, token });
}

export async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const user = await User.findOne({ email: value.email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const match = await user.comparePassword(value.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user);
  return res.json({ user: { id: user._id, name: user.name, email: user.email }, token });
}
