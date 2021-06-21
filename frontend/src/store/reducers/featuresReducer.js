//package imports
import { combineReducers } from 'redux';
//app imports
import authReducer from '../slices/userAuth';
import bookingsReducer from '../slices/bookingsSlice';

const featuresReducer = combineReducers({
  userAuth: authReducer,
  bookings: bookingsReducer,
});

export default featuresReducer;
