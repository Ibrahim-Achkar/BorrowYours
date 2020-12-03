import express from 'express';
const router = express.Router();
import { getUsers, getUserById } from '../controllers/userControllers.js';

router.route('/').get(getUsers);
router.route('/:id').get(getUserById);

export default router;
