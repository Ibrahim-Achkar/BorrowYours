/*
WARNING RUNNING EITHER OF THESE SCRIPTS WILL WIPE THE DATABASE
npm run data:import
npm run data:destroy
*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './users.js';
import items from './items.js';
import User from '../models/userModel.js';
import Item from '../models/itemModel.js';
import Booking from '../models/bookingModel.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Item.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleItems = items.map((item) => {
      return { ...item, user: adminUser };
    });

    await Item.insertMany(sampleItems);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Booking.deleteMany();
    await Item.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
