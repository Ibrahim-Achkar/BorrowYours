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
    categories: [],
    loading: false,
    lastFetch: null,
    error: null,
    success: null,
    page: '',
    pages: '',
  },
  reducers: {
    //requesting list of items
    itemsRequested: (items, action) => {
      items.loading = true;
      // items.item = {}; <-- not needed since componentWillUnMount implemented
      items.error = null;
      items.success = null;
    },
    itemsReceived: (items, action) => {
      items.list = action.payload.items;
      items.page = action.payload.page;
      items.pages = action.payload.pages;
      items.lastFetch = new Date().toString();
      items.loading = false;
      items.success = true;
      items.error = null;
    },
    itemsRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //requesting item categories
    categoriesRequested: (items, action) => {
      items.loading = true;
      items.error = null;
      items.success = null;
    },
    categoriesReceived: (items, action) => {
      items.categories = action.payload;
      items.loading = false;
      items.success = true;
      items.error = null;
    },
    categoriesRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //requesting an item
    itemRequested: (items, action) => {
      items.loading = true;
      items.error = null;
      items.success = null;
    },
    itemReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
      items.error = null;
    },
    itemRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },
    itemRemove: (items, action) => {
      items.item = {};
    },

    //creating an item
    itemCreateRequested: (items, action) => {
      items.loading = true;
      items.error = null;
      items.success = null;
    },
    itemCreateReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
      items.success = true;
      items.error = null;
    },
    itemCreateRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //creating an item
    itemUpdateRequested: (items, action) => {
      items.loading = true;
      items.error = null;
      items.success = null;
    },
    itemUpdateReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
      items.success = true;
      items.error = null;
    },
    itemUpdateRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },
  },
});

//Exports
export const {
  itemsRequested,
  itemsReceived,
  itemsRequestFailed,
  categoriesRequested,
  categoriesReceived,
  categoriesRequestFailed,
  itemRequested,
  itemReceived,
  itemRequestFailed,
  itemRemove,
  itemCreateRequested,
  itemCreateReceived,
  itemCreateRequestFailed,
  itemUpdateRequested,
  itemUpdateReceived,
  itemUpdateRequestFailed,
} = slice.actions;
export default slice.reducer;

//Action creators
//load items into state
export const loadItems =
  (keyword = '', pageNumber = '') =>
  (dispatch, getState) => {
    try {
      return dispatch(
        apiCallBegan({
          url: `/api/v1/items?keyword=${keyword}&pageNumber=${pageNumber}`,
          method: 'get',
          onStart: itemsRequested.type,
          onSuccess: itemsReceived.type,
          onError: itemsRequestFailed.type,
        })
      );
    } catch (error) {
      return error;
    }
  };

//Items Memoisation function
export const getAllItems = createSelector(
  (state) => state.entities.items,
  (items) => items
);

//get all categories
export const loadCategories = () => (dispatch, getState) => {
  try {
    return dispatch(
      apiCallBegan({
        url: `/api/v1/items/categories`,
        method: 'get',
        onStart: categoriesRequested.type,
        onSuccess: categoriesReceived.type,
        onError: categoriesRequestFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};

//Categories memoisation function
export const getAllCategories = createSelector(
  (state) => state.entities.items.categories,
  (categories) => categories
);

//get single item details
export const listItemDetails = (id) => (dispatch, getState) => {
  try {
    return dispatch(
      apiCallBegan({
        url: `/api/v1/items/${id}`,
        method: 'get',
        onStart: itemRequested.type,
        onSuccess: itemReceived.type,
        onError: itemRequestFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};

//removing item from state
export const removeItem = () => (dispatch) => {
  return dispatch(itemRemove());
};

//create an item
export const createItem =
  (
    {
      user,
      name,
      imageURL,
      brand,
      category,
      description,
      barcode,
      countInStock,
    },
    headers
  ) =>
  (dispatch) => {
    try {
      dispatch(
        apiCallBegan({
          url: `/api/v1/items/create_item`,
          data: {
            user,
            name,
            imageURL,
            brand,
            category,
            description,
            barcode,
            countInStock,
          },
          headers,
          method: 'post',
          onStart: itemCreateRequested.type,
          onSuccess: itemCreateReceived.type,
          onError: itemCreateRequestFailed.type,
        })
      );
    } catch (error) {
      return error;
    }
  };

//update an item
export const updateItem = (item, headers) => (dispatch) => {
  try {
    dispatch(
      apiCallBegan({
        url: `/api/v1/items/${item.itemId}`,
        data: item,
        headers,
        method: 'put',
        onStart: itemUpdateRequested.type,
        onSuccess: itemUpdateReceived.type,
        onError: itemUpdateRequestFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};
