import express from 'express';
import { authUser, getAllUsers, registerUser, whoAmI } from './userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/register').post(registerUser);
router.post('/login', authUser);
router.get('/who-am-i', protect, whoAmI);
export default router;
