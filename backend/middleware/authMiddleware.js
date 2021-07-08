//package imports
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
//app imports
import User from '../models/userModel.js';

const userAuth = asyncHandler(async (req, res, next) => {
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

const itemAuth = asyncHandler(async (req, res, next) => {
  //TODO cant strict compare because req.user._id is an object. Consider converting to string

  if (req.body.ownerUserId != req.user._id) {
    /*we can make this comparison because req.user is created by the userAuth middleware querying the DB.
    There are no security issues with someone sending someone else's user id in their request*/
    res.status(401);
    throw new Error('Sorry 🚔 You Cannot Update Items Which Are Not Yours!');
  }

  next();
});

export { userAuth, itemAuth };
