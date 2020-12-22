//package imports
import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
//app imports
import { apiCallBegan } from '../actions/apiActions';

//Slice creator, containing reducer
const slice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    error: null,
  },
  reducers: {
    //requesting list of users
    usersRequested: (users, action) => {
      users.loading = true;
    },
    usersReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
      users.lastFetch = new Date().toString();
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
