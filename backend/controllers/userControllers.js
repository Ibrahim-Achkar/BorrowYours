import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

//@route    GET api/users
//@desc     Get all users from database
//@access   Public
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//@route    GET api/users/:id
//@desc     Get user by id from database
//@access   Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getUsers, getUserById };
