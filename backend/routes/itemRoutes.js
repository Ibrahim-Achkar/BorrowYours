//package imports
import express from 'express';
//app imports
import {
  getItems,
  getCategories,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateItemAvailability,
} from '../controllers/itemControllers.js';
import { admin } from '../middleware/adminMiddleware.js';
import { userAuth, itemAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getItems);
router.route('/categories').get(getCategories);
router.route('/create_item').post(userAuth, createItem);
router.route('/:id').get(getItemById).put(userAuth, itemAuth, updateItem);
router.route('/:id/delete').put(userAuth, itemAuth, deleteItem);
router
  .route('/:id/availability')
  .put(userAuth, itemAuth, updateItemAvailability);

export default router;
