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
    success: null,
    lastFetch: null,
    error: null,
  },
  reducers: {
    //requesting list of users
    usersRequested: (users, action) => {
      users.loading = true;
      users.error = null;
      users.success = null;
    },
    usersReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
      users.success = true;
      users.lastFetch = new Date().toString();
    },
    usersRequestFailed: (users, action) => {
      users.loading = false;
      users.error = action.payload;
    },
  },
});

//Exports
export const { usersReceived, usersRequested, usersRequestFailed } =
  slice.actions;
export default slice.reducer;

//Action creators
export const loadUsers = () => (dispatch, getState) => {
  try {
    return dispatch(
      apiCallBegan({
        url: `/api/v1/users`,
        method: 'get',
        onStart: usersRequested.type,
        onSuccess: usersReceived.type,
        onError: usersRequestFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};

//Memoisation functions
export const getAllUsers = createSelector(
  (state) => state.entities.users,
  (users) => users.list
);
