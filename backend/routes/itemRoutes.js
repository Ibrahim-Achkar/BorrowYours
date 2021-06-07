//package imports
import express from 'express';
//app imports
import {
  getItems,
  getCategories,
  getItemById,
  createItem,
} from '../controllers/itemControllers.js';

const router = express.Router();

router.route('/').get(getItems).post(createItem);
router.route('/categories').get(getCategories);
router.route('/create_item').post(createItem);
router.route('/:id').get(getItemById);

export default router;
