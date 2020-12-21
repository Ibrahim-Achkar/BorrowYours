import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

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

//@desc     Auth user and get token
//@route    POST/api/users/login
//@access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isDelete: user.isDelete,
      favouriteThing: user.favouriteThing,
      imageURL: user.imageURL,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error(`Invalid email or password`);
  }
});

export { getUsers, getUserById, authUser };
