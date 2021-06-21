//package imports
import asyncHandler from 'express-async-handler';
//app imports
// import Item from '../models/itemModel.js';
// import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';

/*Routes:
 * POST   /api/v1/bookings/create_booking  Create a booking     Public (for now)
 */

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

export { createBooking };
