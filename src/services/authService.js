import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

export const registerService = async (validatedData) => {
  const exists = await User.findOne({ email: validatedData.email });
  if (exists) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const user = await User.create(validatedData);
  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const match = await user.comparePassword(password);
  if (!match) {
    throw new Error('INVALID_CREDENTIALS');
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    token
  };
};
