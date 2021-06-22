//package imports
import asyncHandler from 'express-async-handler';
//app imports
import Item from '../models/itemModel.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';

/*Routes:
 * POST   /api/v1/bookings/create_booking  Create a booking               Public (for now)
 * GET    /api/v1/bookings/getBookings     Get bookings from database     Public (for now)
 */

//@desc     Get bookings from database
//@route    GET /api/v1/bookings
//@access   Public (for now)
const getBookings = asyncHandler(async (req, res) => {
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
  /*TODO search is broken here because search needs to be done on the children 
    (use match like in the reserved dates)*/
  const count = await Booking.countDocuments({ ...keyword });
  const bookings = await Booking.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate('item', 'name', Item)
    .populate('owner', 'name', User)
    .populate('reserver', 'name', User);

  if (bookings) {
    res.json({ bookings, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(401);
    throw new Error(`Bookings not found 🔍`);
  }
});

//@desc     create a booking
//@route    POST /api/v1/bookings/create_booking
//@access   Public (for now)

const createBooking = asyncHandler(async (req, res) => {
  const mongoBooking = async (data) => {
    return new Booking({
      item: data.item,
      owner: data.owner,
      reserver: data.reserver,
      reservedDates: data.reservedDates,
    });
  };

  const booking = await mongoBooking(req.body);

  const createdBooking = await booking.save();
  if (createdBooking) {
    res.status(201).json(createdBooking);
  } else {
    res.status(400);
    throw new Error(`There was an error making your booking`);
  }
});

export { createBooking, getBookings };
