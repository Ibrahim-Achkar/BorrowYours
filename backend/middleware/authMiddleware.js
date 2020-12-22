//package imports
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
//app imports
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      //submitting token, decoded returns id
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //finding user by decoded.id, don't return password
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not Authorised 🚔 Wrong Token!');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not Authorised 🚔 Where Your Token At?');
  }
});

export { protect };
