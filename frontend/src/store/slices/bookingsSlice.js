//package imports
import { createSlice } from '@reduxjs/toolkit';
//app imports
import { apiCallBegan } from '../actions/apiActions';

//Slice creator, containing reducer
const slice = createSlice({
  name: 'bookings',
  initialState: {
    booking: {},
    list: [],
    loading: null,
    error: null,
    success: null,
    pages: '',
  },
  reducers: {
    //creating a booking
    bookingCreateRequested: (bookings, action) => {
      bookings.loading = true;
      bookings.error = null;
      bookings.success = null;
    },
    bookingCreateReceived: (bookings, action) => {
      bookings.booking = action.payload;
      bookings.loading = false;
      bookings.success = true;
      bookings.error = null;
    },
    bookingCreateRequestFailed: (bookings, action) => {
      bookings.loading = false;
      bookings.error = action.payload;
    },
  },
});

//Exports
export const {
  bookingCreateRequested,
  bookingCreateReceived,
  bookingCreateRequestFailed,
} = slice.actions;
export default slice.reducer;

//Action creators
//Create a booking
export const createBooking =
  ({ item, owner, reserver, reservedDates }, headers) =>
  (dispatch) => {
    try {
      dispatch(
        apiCallBegan({
          url: `/api/v1/bookings/create_booking`,
          data: {
            item,
            owner,
            reserver,
            reservedDates,
          },
          headers,
          method: 'post',
          onStart: bookingCreateRequested.type,
          onSuccess: bookingCreateReceived.type,
          onError: bookingCreateRequestFailed.type,
        })
      );
    } catch (error) {
      return error;
    }
  };
