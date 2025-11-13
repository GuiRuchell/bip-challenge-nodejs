import mongoose from 'mongoose';

const connectDB = async (uri = 'mongodb://localhost:27017/desafio') => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
};

export default connectDB;
