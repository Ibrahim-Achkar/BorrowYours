//package imports
import { createSlice, createSelector } from '@reduxjs/toolkit';
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
    //requesting list of items
    bookingsRequested: (bookings, action) => {
      bookings.loading = true;
      bookings.item = {};
      bookings.error = null;
      bookings.success = null;
    },
    bookingsReceived: (bookings, action) => {
      bookings.list = action.payload.bookings;
      bookings.page = action.payload.page;
      bookings.pages = action.payload.pages;
      bookings.lastFetch = new Date().toString();
      bookings.loading = false;
      bookings.success = true;
      bookings.error = null;
    },
    bookingsRequestFailed: (bookings, action) => {
      bookings.loading = false;
      bookings.error = action.payload;
    },

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
  bookingsRequested,
  bookingsReceived,
  bookingsRequestFailed,
} = slice.actions;
export default slice.reducer;

//Action creators
//load items into state
export const loadBookings =
  (keyword = '', pageNumber = '') =>
  (dispatch, getState) => {
    try {
      return dispatch(
        apiCallBegan({
          url: `/api/v1/bookings?keyword=${keyword}&pageNumber=${pageNumber}`,
          method: 'get',
          onStart: bookingsRequested.type,
          onSuccess: bookingsReceived.type,
          onError: bookingsRequestFailed.type,
        })
      );
    } catch (error) {
      return error;
    }
  };

//Items Memoisation function
export const getAllBookings = createSelector(
  (state) => state.features.bookings,
  (bookings) => bookings
);

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
