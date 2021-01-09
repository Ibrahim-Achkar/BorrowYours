//package imports
import express from 'express';
//app imports
import {
  authUser,
  registerUser,
  getUserLoginDetails,
  updateUserProfile,
  getUsers,
  getUserById,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(getUsers);
router
  .route('/profile')
  .get(protect, getUserLoginDetails)
  .put(protect, updateUserProfile);
router.route('/:id').get(getUserById);
router.post('/login', authUser);

export default router;
