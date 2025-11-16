import User from '../models/User.js';

export async function getProfile(userPayload) {
  return {
    id: userPayload._id,
    name: userPayload.name,
    email: userPayload.email
  };
}

export async function listUsers() {
  return await User.find().select('-password');
}
