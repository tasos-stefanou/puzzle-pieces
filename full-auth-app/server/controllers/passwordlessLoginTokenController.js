import User from '../models/userModel.js';
import { sendPasswordlessLoginEmail } from '../utils/emails.js';
import PasswordlessLoginToken from '../models/passwordlessLoginTokenModel.js';

// @desc generate new reset password token
// @route Get /api/passwordless-login-token/generate/:email
// @access Public
const generatePasswordlessLoginToken = async (req, res) => {
  const { email } = req.params;

  const userExistsByEmail = await User.findOne({ email: email });
  if (!userExistsByEmail) {
    return res.status(400).json({ error_message: `There is no user registered with email: ${email}` });
  }

  const createdAt = new Date();
  const expiresAt = new Date();
  expiresAt.setMinutes(createdAt.getMinutes() + 5);

  const passwordlessLoginToken = new PasswordlessLoginToken({
    email,
    createdAt,
    expiresAt,
  });

  try {
    const createdPasswordlessLoginToken = await passwordlessLoginToken.save();
    sendPasswordlessLoginEmail(email, createdPasswordlessLoginToken._id);
    res.status(201).json({ message: 'Email was sent successfully!' });
  } catch (error) {
    res.status(500).json({ error_message: 'Could not send email!' });
  }
};

const checkPasswordlessLoginTokenAndFetchUserEmailInternal = async (tokenId) => {
  try {
    const tokenExists = await PasswordlessLoginToken.findOne({ _id: tokenId });
    if (!tokenExists) {
      throw new Error('Token does not exist!');
    }
    await PasswordlessLoginToken.findByIdAndDelete(tokenId);
    return tokenExists.email;
  } catch (error) {
    throw new Error('Something went wrong when checking the token!');
  }
};
export { generatePasswordlessLoginToken, checkPasswordlessLoginTokenAndFetchUserEmailInternal };
