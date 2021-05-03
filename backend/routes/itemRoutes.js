//package imports
import express from 'express';
//app imports
import { getItems, getItemById } from '../controllers/itemControllers.js';

const router = express.Router();

router.route('/').get(getItems);
router.route('/:id').get(getItemById);

export default router;
