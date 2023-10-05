import express from 'express';
import { generatePasswordlessLoginToken } from '../controllers/passwordlessLoginTokenController.js';
const router = express.Router();

router.route('/generate/:email').get(generatePasswordlessLoginToken);

export default router;
