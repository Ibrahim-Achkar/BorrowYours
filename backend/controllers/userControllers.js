//package imports
import asyncHandler from 'express-async-handler';
//app imports
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

/**Routes:
 * POST   api/users/login       User Login (Auth & Token)   Public
 * POST   api/users             Register New User           Public
 * GET    api/users/profile     Return User Information     Private
 * PUT    api/users/profile     Update User Information     Private
 * GET    api/users             Get list of users           Admin
 * GET    api/users/:id         Get user by id              Admin
 */

//@desc     Auth user and get token
//@route    POST api/users/login
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

//@desc     Register a new user
//@route    POST/api/users
//@access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User Already Exists 😱');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
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
    res.status(400);
    throw new Error('Invalid User Data 💔');
  }
});

//@desc     Get user profile
//@route    GET /api/users/profile
//@access   Private
const getUserLoginDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isDelete: user.isDelete,
      favouriteThing: user.favouriteThing,
      imageURL: user.imageURL,
    });
  } else {
    res.status(404);
    throw new Error('Invalid Email or Password 🙈');
  }
});

//@desc     Update user profile
//@route    PUT /api/users/profile
//@access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.favouriteThing = req.body.favouriteThing || user.favouriteThing;
    user.imageURL = req.body.imageURL || user.imageURL;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isDelete: updatedUser.isDelete,
      favouriteThing: updatedUser.favouriteThing,
      imageURL: updatedUser.imageURL,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found 👻');
  }
});

//@route    GET api/users
//@desc     Get all users from database
//@access   Private - Admin Only - TODO
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

//@route    GET api/users/:ids
//@desc     Get user by id from database
//@access   Private - Admin Only - TODO
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getUserLoginDetails,
  updateUserProfile,
  getUsers,
  getUserById,
};
