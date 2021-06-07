//package imports
import asyncHandler from 'express-async-handler';
//app imports
import Item from '../models/itemModel.js';
import Category from '../models/itemCategoryModel.js';

//@desc     Get all items from database
//@route    GET api/items
//@access   Public
const getItems = asyncHandler(async (req, res) => {
  const pageSize = 5;
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
    .skip(pageSize * (page - 1))
    .populate('user', 'name')
    .populate('category', 'name', Category);

  res.json({ items, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get all categories from database
//@route    GET /api/items/categories
//@access   Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

//@desc     Get item by id from database
//@route    GET api/items/:id
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

//@desc     create an item
//@route    POST/api/items/create_item
//@access   Public (for now)

const createItem = asyncHandler(async (req, res) => {
  const mongoItem = async (data) => {
    return new Item({
      user: data.user,
      name: data.name,
      imageURL: data.imageURL,
      brand: data.brand,
      category: data.category,
      description: data.description,
      barcode: data.barcode,
      countInStock: data.countInStock,
      isAvailable: false,
      isDelete: false,
    });
  };

  const item = await mongoItem(req.body);

  const createdItem = await item.save();

  res.status(201).json(createdItem);
});

export { getItems, getCategories, getItemById, createItem };
