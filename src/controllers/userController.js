import User from '../models/User.js';

export async function getProfile(req, res) {
  const user = req.user;
  return res.json({ id: user._id, name: user.name, email: user.email });
}

export async function listUsers(req, res) {
  const users = await User.find().select('-password');
  return res.json(users);
}
