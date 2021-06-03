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
    item: {},
    loading: false,
    lastFetch: null,
    error: null,
    page: '',
    pages: '',
  },
  reducers: {
    //requesting list of items
    itemsRequested: (items, action) => {
      items.loading = true;
      items.item = {}; //TODO check if this is a good thing to do here
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

    //requesting an item
    itemRequested: (items, action) => {
      items.loading = true;
    },
    itemReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
    },
    itemRequestFailed: (items, action) => {
      items.loading = false;
    },
  },
});

//Exports
export const {
  itemsRequested,
  itemsReceived,
  itemsRequestFailed,
  itemRequested,
  itemReceived,
  itemRequestFailed,
} = slice.actions;
export default slice.reducer;

//Action creators
//load items into state
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

//get single item details
export const listItemDetails = (id) => (dispatch, getState) => {
  return dispatch(
    apiCallBegan({
      url: `/api/items/${id}`,
      method: 'get',
      onStart: itemRequested.type,
      onSuccess: itemReceived.type,
      onError: itemRequestFailed.type,
    })
  );
};

//Memoisation functions
export const getAllItems = createSelector(
  (state) => state.entities.items,
  (items) => items
);

//create an item
export const createItem = () => (dispatch, getState) => {
  console.log('hello');
};
