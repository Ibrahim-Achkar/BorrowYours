//package imports
import express from 'express';
//app imports
import {
  createBooking,
  getBookings,
  getBookingById,
} from '../controllers/bookingControllers.js';

const router = express.Router();

router.route('/').get(getBookings);
router.route('/:id').get(getBookingById);
router.route('/create_booking').post(createBooking);

export default router;
