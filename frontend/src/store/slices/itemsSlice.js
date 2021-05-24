//package imports
import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
//app imports
import { apiCallBegan } from '../actions/apiActions';

//Slice creator, containing reducer
const slice = createSlice({
  name: 'items',
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    error: null,
    page: '',
    pages: '',
  },
  reducers: {
    //requesting list of users
    itemsRequested: (items, action) => {
      items.loading = true;
    },
    itemsReceived: (items, action) => {
      items.list = action.payload.items;
      items.page = action.payload.page;
      items.pages = action.payload.pages;
      items.loading = false;
      items.lastFetch = new Date().toString();
    },
    itemsRequestFailed: (items, action) => {
      items.loading = false;
    },
  },
});

//Exports
export const { itemsReceived, itemsRequested, itemsRequestFailed } =
  slice.actions;
export default slice.reducer;

//Action creators
export const loadItems =
  (keyword = '', pageNumber = '') =>
  (dispatch, getState) => {
    return dispatch(
      apiCallBegan({
        url: `/api/items?keyword=${keyword}&pageNumber=${pageNumber}`,
        method: 'get',
        onStart: itemsRequested.type,
        onSuccess: itemsReceived.type,
        onError: itemsRequestFailed.type,
      })
    );
  };

//Memoisation functions
export const getAllItems = createSelector(
  (state) => state.entities.items,
  (items) => items
  // (items) => items.list
);
