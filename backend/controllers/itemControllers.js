import asyncHandler from 'express-async-handler';
import Item from '../models/itemModel.js';

//@route    GET api/items
//@desc     Get all items from database
//@access   Public
const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({});
  res.json(items);
});

//@route    GET api/items/:id
//@desc     Get item by id from database
//@access   Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (item) {
    res.json(item);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export { getItems, getItemById };
