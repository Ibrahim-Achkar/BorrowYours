//package imports
import asyncHandler from 'express-async-handler';
//app imports
import Item from '../models/itemModel.js';
import Category from '../models/itemCategoryModel.js';
import Bookings from '../models/bookingModel.js';

/*Routes:
 * GET    /api/v1/items                   Get all items from database        Public
 * GET    /api/v1/items/available         Get available items from database  Public
 * GET    /api/v1/items/categories        Get all categories from database   Public
 * GET    /api/v1/items/:id               Get item by id from database       Public
 * POST   /api/v1/items/create_item       Create an item                     Private
 * PUT    /api/v1/items/:id/edit          Edit an item                       Private
 * PUT    /api/v1/items/:id               Delete an item                     Private
 * PUT    /api/v1/items/:id/availability  Update item availability           Private
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

  //setting up find params to insert into mongoose method
  const findParams = {
    isDelete: 'false',
    ...keyword,
  };

  /*we only want to provide items that are not available if requested in the headers. 
  only the user dashboard table will want to display this data*/
  if (req.headers.wantnotavailable == 'false') {
    findParams.isAvailable = 'true';
  }

  const count = await Item.countDocuments(findParams);
  const items = await Item.find(findParams)
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

  /*TODO this is an expensive way of finding the bookings for the item and 
  then only returning those bookings for the item because: 
  * the populate is still returning all the bookings - except those 
  * the filter then has to filter all the bookings that don't have an item of null
  * THIS WILL NOT SCALE LOL 😛
  */
  const bookings = await Bookings.find({}).populate({
    path: 'item',
    match: { _id: { $eq: req.params.id } },
  });

  const filtered = bookings.filter((booking) => {
    if (
      booking.item &&
      booking.isCancelled === false && //if booking is not cancelled we want to gray out that date in the calendar
      booking.isComplete === false //if booking is not complete we want to gray out that date in the calendar
    ) {
      return booking;
    }
  });

  const bookedDates = [];

  filtered.forEach((booking) => bookedDates.push(...booking.reservedDates));

  if (item) {
    res.json({
      ...item._doc, //spread the first level of item values into an empty object (ie name, isAvailable, etc)
      category: item.category.name, //replace the category object with just the category name
      user: item.user.name, //replace the user object with just the user name
      userId: item.user._id, //insert the user Id
      bookedDates,
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

//@desc     update an item
//@route    PUT/api/v1/items/:id
//@access   Public (for now)
const updateItem = asyncHandler(async (req, res) => {
  const {
    name,
    user,
    imageURL,
    brand,
    category,
    description,
    barcode,
    countInStock,
    isAvailable,
    isDelete,
  } = req.body;

  const item = await Item.findById(req.params.id);

  if (item) {
    item.name = name;
    // item.user = user;
    if (imageURL) {
      item.imageURL = imageURL;
    }
    item.brand = brand;
    item.category = category;
    item.description = description;
    item.barcode = barcode;
    item.countInStock = countInStock;
    // item.isAvailable = isAvailable;
    // item.isDelete = isDelete;

    const updatedItem = await item.save();
    res.status(201).json(updatedItem);
  } else {
    res.status(404);
    throw new Error('Item not found');
  }
});

//@desc     Delete an item
//@route    PUT/api/v1/items/:id <- setting delete flag so not using DELETE
//@access   private
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    item.isDelete = true;
    const updatedItem = await item.save();
    res.status(201).json(updatedItem);
  } else {
    res.status(400);
    throw new Error(`Item not found`);
  }
});

//@desc     Update item availability
//@route    PUT/api/v1/items/:id/availability
//@access   private
const updateItemAvailability = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);

  if (item) {
    item.isAvailable = req.body.isAvailable;
    const updatedItem = await item.save();
    res.status(201).json(updatedItem);
  } else {
    res.status(400);
    throw new Error(`Item not found`);
  }
});

export {
  getItems,
  getCategories,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateItemAvailability,
};
