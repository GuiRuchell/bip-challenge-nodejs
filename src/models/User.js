import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function hash(next) {
    if (!this.isModified('password')) return next();
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
});

UserSchema.methods.comparePassword = async function compare(plain) {
    return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', UserSchema);
