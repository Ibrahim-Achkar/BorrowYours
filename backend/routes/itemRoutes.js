import express from 'express';
const router = express.Router();
import { getItems, getItemById } from '../controllers/itemControllers.js';

router.route('/').get(getItems);
router.route('/:id').get(getItemById);

export default router;
