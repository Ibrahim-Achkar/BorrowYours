import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import morgan from 'morgan';
import colors from 'colors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';

//Bring in global variables
dotenv.config();

//Initialise express
const app = express();

//Connect to database
connectDB();

//Turn on morgan if in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('short'));
}

//Middleware
app.use(express.json());

//Connect to PORT set in global environment, or else 5000
const PORT = process.env.PORT || 5000;

//Mount routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

//Errors & Error middleware
app.use(notFound);
app.use(errorHandler);

//Log server status
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`.yellow.bold
  )
);
