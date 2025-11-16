import mongoose from 'mongoose';

const { Schema } = mongoose;

const TransactionSchema = new Schema({
  from: { type: Schema.Types.ObjectId, ref: 'Account' },
  to: { type: Schema.Types.ObjectId, ref: 'Account' },

  account: { type: Schema.Types.ObjectId, ref: 'Account' },

  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'transfer'], required: true },
  amount: { type: Number, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);