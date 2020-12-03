import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../actions/apiActions';
import { createSelector } from 'reselect';
// import { differenceInMinutes } from 'date-fns';

const lastDate = new Date();
const dateString = lastDate.toString();

//Slice creator, containing reducer
const slice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    usersRequested: (users, action) => {
      users.loading = true;
    },

    usersReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
      users.lastFetch = dateString;
    },

    usersRequestFailed: (users, action) => {
      users.loading = false;
    },
  },
});

//Exports
export const {
  usersReceived,
  usersRequested,
  usersRequestFailed,
} = slice.actions;
export default slice.reducer;

//Action creators

//Getting list of users from server
export const loadUsers = () => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url: `/api/users`,
      onStart: usersRequested.type,
      onSuccess: usersReceived.type,
      onError: usersRequestFailed.type,
    })
  );
};

//Memoisation functions
export const getAllUsers = createSelector(
  (state) => state.entities.users,
  (users) => users.list
);
