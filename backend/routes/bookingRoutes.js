//package imports
import express from 'express';
//app imports
import { createBooking } from '../controllers/bookingControllers.js';

const router = express.Router();

router.route('/');
router.route('/create_booking').post(createBooking);

export default router;
