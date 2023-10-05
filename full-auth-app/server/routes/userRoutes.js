import express from 'express';
import { authUser, registerUser, activateUserAccount, authWithMagicLink } from '../controllers/userController.js';
const router = express.Router();

router.route('/register').post(registerUser);
router.post('/login', authUser);
router.get('/activate/:tokenId', activateUserAccount);
router.get('/login-with-magic-link/:tokenId', authWithMagicLink);
export default router;
