import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import 'express-async-errors';
import errorHandler from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import accountRoutes from './routes/accounts.js';
import transactionRoutes from './routes/transactions.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

// health
app.get('/', (req, res) => res.json({ ok: true }));

app.use(errorHandler);

export default app;
