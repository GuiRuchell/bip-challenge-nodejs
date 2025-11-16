import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { createAccount, getAccounts, getAccount } from '../controllers/accountController.js';

const router = Router();

router.use(auth);

router.post('/', createAccount);
router.get('/', getAccounts);
router.get('/:id', getAccount);

export default router;