import ActivateAccountToken from '../models/activateAccountTokenModel.js';
import User from '../models/userModel.js';
import { sendActivationEmail } from '../utils/emails.js';
import generateToken from '../utils/generateTokens.js';
import { checkPasswordlessLoginTokenAndFetchUserEmailInternal } from './passwordlessLoginTokenController.js';

// @desc Register a new user
// @route Post /api/users/register
// @access Public
const registerUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(500).json({ error_message: 'Insufficient data for registration!' });
  }

  const userExistsByEmail = await User.findOne({ email: email });
  if (userExistsByEmail) {
    return res.status(400).json({ error_message: `User with email: ${email} already exists!` });
  }
  const userExistsByUsername = await User.findOne({ username: username });
  if (userExistsByUsername) {
    return res.status(400).json({ error_message: `User with username: ${username} already exists!` });
  }

  const newUser = await User.create({
    name,
    username,
    email,
    password,
  });

  if (newUser) {
    try {
      const newActivateAccountToken = await ActivateAccountToken.create({
        userId: newUser._id,
      });
      sendActivationEmail(newUser.email, newActivateAccountToken._id);
      return res.status(201).json(newActivateAccountToken);
    } catch (error) {
      console.log('Could not create aa token');
      return res.status(500).json({ error_message: 'Could not create token!' });
    }
  } else {
    return res.status(500).json({ error_message: 'Could not create user!' });
  }
};

// @desc Activate a new user
// @route Post /api/users/activate/:tokenId
// @access Public
const activateUserAccount = async (req, res) => {
  try {
    const activateAccountToken = await ActivateAccountToken.findById(req.params.tokenId);
    if (!activateAccountToken) {
      return res.status(400).json({ error_message: 'Invalid token.' });
    }

    const user = await User.findById(activateAccountToken.userId);
    if (!user) {
      return res.status(400).json({ error_message: 'Could not find user' });
    }
    user.isActivated = true;
    try {
      const activatedUser = await user.save();
      res.status(200).json({
        _id: activatedUser._id,
        name: activatedUser.name,
        username: activatedUser.username,
        email: activatedUser.email,
        isAdmin: activatedUser.isAdmin,
        token: generateToken(activatedUser._id),
      });
      await ActivateAccountToken.deleteOne({ _id: req.params.tokenId });
      return;
    } catch (error) {
      console.log('Could not save updated user');
      return res.status(500).json({
        error_message: 'Could not activate account please refresh the page!',
      });
    }
  } catch (error) {
    console.log('Error with token');
    return res.status(404).json({ error_message: 'Something went wrong. Probably the link is invalid' });
  }
};

// @desc Auth user & get token
// @route Post /api/users/login
// @access Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (user) {
    if (user.isActivated) {
      if (await user.matchPassword(password)) {
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      } else {
        return res.status(403).json({ error_message: 'Wrong password!' });
      }
    } else {
      return res.status(403).json({ error_message: 'Account not activated!' });
    }
  } else {
    return res.status(401).json({ error_message: 'Could not find user!' });
  }
};

// @desc Auth user with magic link & get token
// @route Post /api/users/login-with-magic-link/:tokenId
// @access Public
const authWithMagicLink = async (req, res) => {
  const { tokenId } = req.params;
  let email = '';

  try {
    email = await checkPasswordlessLoginTokenAndFetchUserEmailInternal(tokenId);
  } catch (error) {
    return res.status(404).json({ error_message: 'Something went wrong. Probably the link is invalid' });
  }

  const user = await User.findOne({ email: email });
  if (user) {
    if (user.isActivated) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      return res.status(403).json({ error_message: 'Account not activated!' });
    }
  } else {
    return res.status(401).json({ error_message: 'Could not find user!' });
  }
};

// @desc Get user profile
// @route Get /api/users/profile
// @access Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error_message: 'User not found!' });
  }

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

// @desc Update user profile
// @route Put /api/users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error_message: 'User not found!' });
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  return res.status(201).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser._id),
  });
};

// @desc Get all users
// @route GET /api/users/
// @access Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.status(200).json(users);
};

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ error_message: 'User not found!' });
  }

  return res.status(200).json(user);
};

// @desc Update user
// @route Put /api/users/:id
// @access Private/Admin
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error_message: 'User not found!' });
  }
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin;
  //  WE DONT WANT THE ADMIN TO BE ABLE TO CHANGE USER'S PASS
  // if (req.body.password) {
  //   user.password = req.body.password;
  // }

  const updatedUser = await user.save();

  return res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  });
};

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error_message: 'User not found!' });
  }
  await User.deleteOne({ _id: req.params.id });
  return res.status(200).json({ message: 'User removed' });
};

export {
  updateUserProfile,
  activateUserAccount,
  authUser,
  authWithMagicLink,
  getUserProfile,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
