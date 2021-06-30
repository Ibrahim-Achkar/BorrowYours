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
    //requesting list of bookings
    bookingsRequested: (bookings, action) => {
      bookings.loading = true;
      bookings.booking = {};
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

    //requesting an booking
    bookingRequested: (bookings, action) => {
      bookings.loading = true;
      bookings.error = null;
      bookings.success = null;
    },
    bookingReceived: (bookings, action) => {
      bookings.booking = action.payload;
      bookings.loading = false;
      bookings.error = null;
    },
    bookingRequestFailed: (bookings, action) => {
      bookings.loading = false;
      bookings.error = action.payload;
    },
    bookingRemove: (bookings, action) => {
      bookings.booking = {};
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
  bookingRequested,
  bookingReceived,
  bookingRequestFailed,
  bookingRemove,
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

//Bookings Memoisation function
export const getAllBookings = createSelector(
  (state) => state.features.bookings,
  (bookings) => bookings
);

//get single booking details
export const listBookingDetails = (id) => (dispatch, getState) => {
  try {
    return dispatch(
      apiCallBegan({
        url: `/api/v1/bookings/${id}`,
        method: 'get',
        onStart: bookingRequested.type,
        onSuccess: bookingReceived.type,
        onError: bookingRequestFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};

//removing booking from state
export const removeBooking = () => (dispatch) => {
  return dispatch(bookingRemove());
};

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
