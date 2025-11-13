import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { transfer, deposit, listTransactions } from '../controllers/transactionController.js';

const router = Router();

router.use(auth);
router.post('/deposit', deposit);        
router.post('/transfer', transfer);      
router.get('/', listTransactions);      

export default router;