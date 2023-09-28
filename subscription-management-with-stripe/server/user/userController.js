import User from './userModel.js';
import generateToken from '../utils/generateTokens.js';
import { sendActivationEmail } from '../utils/emails.js';
import { retrieveCustomerSubscriptions } from '../stripe/stripeController.js';

// @desc Register a new user
// @route Post /api/users/register
// @access Public
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.status(500).json({ error_message: 'Insufficient data for registration!' });
    return;
  }

  const userExistsByEmail = await User.findOne({ email: email });
  if (userExistsByEmail) {
    res.status(400).json({ error_message: `User with email: ${email} already exists!` });
    return;
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
  });

  sendActivationEmail(email);
  return res.status(201).json(newUser);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(400).json({
      message: error.message,
    });
  }
};

// @desc Auth user & get token
// @route Post /api/users/login
// @access Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(403).json({ message: 'Wrong password!' });
    }
  } else {
    res.status(401).json({ message: 'Could not find user!' });
  }
};

// @desc Token validation for user
// @route Get /api/users/who-am-i
// @access Public
const whoAmI = async (req, res) => {
  let userSubscriptions = [];
  if (req.user.customerId) {
    try {
      userSubscriptions = await retrieveCustomerSubscriptions(req.user.customerId);
    } catch (error) {
      console.log(error);
    }
  }
  res.status(200).json({ user: req.user, userSubscriptions });
  return;
};

export { authUser, registerUser, whoAmI, getAllUsers };
