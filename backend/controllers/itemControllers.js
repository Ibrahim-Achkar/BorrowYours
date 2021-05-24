//package imports
import asyncHandler from 'express-async-handler';
//app imports
import Item from '../models/itemModel.js';

//@route    GET api/items
//@desc     Get all items from database
//@access   Public
const getItems = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}; //if no keyword, return empty object
  const count = await Item.countDocuments({ ...keyword });
  const items = await Item.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ items, page, pages: Math.ceil(count / pageSize) });
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
    throw new Error('Item not found');
  }
});

export { getItems, getItemById };
