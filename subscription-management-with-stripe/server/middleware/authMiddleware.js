import jwt from 'jsonwebtoken';
import User from '../user/userModel.js';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) throw Error('User does not exist');
      next();
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
};

export { protect };
