//package imports
import express from 'express';
//app imports
import {
  getItems,
  getItemById,
  createItem,
} from '../controllers/itemControllers.js';

const router = express.Router();

router.route('/').get(getItems).post(createItem);
router.route('/create_item').post(createItem);
router.route('/:id').get(getItemById);

export default router;
