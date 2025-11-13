import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['savings', 'checking'], required: true },
  balance: { type: Number, required: true, min: 0, default: 0 }
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);