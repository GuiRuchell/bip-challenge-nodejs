import * as userService from '../services/userService.js';

export async function getProfile(req, res) {
  const profile = await userService.getProfile(req.user);
  return res.json(profile);
}

export async function listUsers(req, res) {
  const users = await userService.listUsers();
  return res.json(users);
}
