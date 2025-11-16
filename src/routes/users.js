import { Router } from 'express';
import auth from '../middlewares/auth.js';
import { getProfile, listUsers } from '../controllers/userController.js';

const router = Router();

router.use(auth);
router.get('/me', getProfile);
router.get('/', listUsers);

export default router;
