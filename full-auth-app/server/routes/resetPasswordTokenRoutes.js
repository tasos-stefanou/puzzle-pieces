import express from 'express'
import {
  generateResetPasswordToken,
  checkResetPasswordToken,
} from '../controllers/resetPasswordTokenController.js'
const router = express.Router()

router.route('/generate/:email').get(generateResetPasswordToken)
router.route('/check/').post(checkResetPasswordToken)
export default router
