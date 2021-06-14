//package imports
import asyncHandler from 'express-async-handler';
//app imports
import Item from '../models/itemModel.js';
import Category from '../models/itemCategoryModel.js';

/*Routes:
 * GET    /api/v1/items              Get all items from database        Public
 * GET    /api/v1/items/categories   Get all categories from database   Public
 * GET    /api/v1/items/:id          Get item by id from database       Public
 * POST   /api/v1/items/create_item  Create an item                     Public (for now)
 */

//@desc     Get all items from database
//@route    GET /api/v1/items
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
    : {};
  const count = await Item.countDocuments({ ...keyword });
  const items = await Item.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('user', 'name')
    .populate('category', 'name', Category);

  if (items) {
    res.json({ items, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(401);
    throw new Error(`Items not found 🔍`);
  }
});

//@desc     Get all categories from database
//@route    GET /api/v1/items/categories
//@access   Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  if (categories) {
    res.json(categories);
  } else {
    throw new Error(`Categories not found 🔍`);
  }
});

//@desc     Get item by id from database
//@route    GET /api/v1/items/:id
//@access   Public
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id)
    .populate('user', 'name')
    .populate('category', 'name', Category);

  if (item) {
    res.json({
      ...item._doc, //spread the first level of item values into an empty object (ie name, isAvailable, etc)
      category: item.category.name, //replace the category object with just the category name
      user: item.user.name, //replace the user object with just the user name
    }); //after all of this have a flat object which won't trigger any React Children as Object errors
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

//@desc     create an item
//@route    POST /api/v1/items/create_item
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
  if (createdItem) {
    res.status(201).json(createdItem);
  } else {
    res.status(400);
    throw new Error(`Invalid Item Data`);
  }
});

export { getItems, getCategories, getItemById, createItem };
