import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUserById,
  authUser,
} from '../controllers/userControllers.js';

router.route('/').get(getUsers);
router.route('/:id').get(getUserById);
router.post('/login', authUser);

export default router;
