import asyncHandler from 'express-async-handler';
import ResetPasswordToken from '../models/resetPasswordTokenModel.js';
import User from '../models/userModel.js';
import { sendResetPasswordEmail } from '../utils/emails.js';

// @desc generate new reset password token
// @route Post /api/reset-password-token/generate
// @access Public
const generateResetPasswordToken = async (req, res) => {
  const { email } = req.params;

  const userExistsByEmail = await User.findOne({ email: email });
  if (!userExistsByEmail) {
    return res.status(400).json({ error_message: `There is no user registered with email: ${email}` });
  }

  const createdAt = new Date();
  const expiresAt = new Date();
  expiresAt.setMinutes(createdAt.getMinutes() + 5);

  const resetPasswordToken = await ResetPasswordToken.create({
    email,
    createdAt,
    expiresAt,
  });

  if (resetPasswordToken) {
    sendResetPasswordEmail(email, resetPasswordToken._id);
    return res.status(201).json(resetPasswordToken);
  } else {
    return res.status(400).json({ error_message: 'Sorry, could not reset password!' });
  }
};

const checkResetPasswordToken = async (req, res) => {
  const newPassword = req.body.password;
  let resetPasswordToken;
  if (!newPassword) {
    return res.status(500).json({ error_message: 'No password provided!' });
  }

  try {
    resetPasswordToken = await ResetPasswordToken.findById(req.body.tokenId);
  } catch (error) {
    return res.status(500).json({ error_message: 'Invalid token!' });
  }

  if (!resetPasswordToken) {
    return res.status(500).json({ error_message: 'Incorrect url. Please go to login!' });
  }

  const now = new Date();
  if (resetPasswordToken.expiresAt.getTime() < now.getTime()) {
    return res.status(500).json({ error_message: 'Sorry, this token has expired.' });
  }

  // TODO: change user password
  const user = await User.findOne({ email: resetPasswordToken.email });
  // TODO: is it a reachable path?
  if (!user) {
    return res.status(400).json({ error_message: `There is no user registered with email: ${email}` });
  }
  try {
    user.password = newPassword;
    await user.save();
    res.status(201).json({ message: 'Your password has been reset successfully!' });
  } catch (error) {
    res.status(500).json({ error_message: `Could not reset password of user: ${user?.email}!` });
  }

  await ResetPasswordToken.findByIdAndDelete(req.params.id);
};

export { generateResetPasswordToken, checkResetPasswordToken };
