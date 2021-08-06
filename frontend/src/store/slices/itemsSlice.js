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
    lastFetch: null,
    loading: false,
    success: false,
    error: false,
    page: '',
    pages: '',
  },
  reducers: {
    //requesting list of items
    itemsRequested: (items, action) => {
      items.loading = true;
      items.error = false;
      items.success = false;
    },
    itemsReceived: (items, action) => {
      items.list = action.payload.items;
      items.page = action.payload.page;
      items.pages = action.payload.pages;
      items.lastFetch = new Date().toString();
      items.loading = false;
      items.success = true;
    },
    itemsRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //requesting item categories
    categoriesRequested: (items, action) => {
      items.loading = true;
      items.error = false;
      items.success = false;
    },
    categoriesReceived: (items, action) => {
      items.categories = action.payload;
      items.loading = false;
      items.success = true;
    },
    categoriesRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //requesting an item
    itemRequested: (items, action) => {
      items.loading = true;
      items.error = false;
      items.success = false;
    },
    itemReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
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
      items.error = false;
      items.success = false;
    },
    itemCreateReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
      items.success = true;
    },
    itemCreateRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //creating an item
    itemUpdateRequested: (items, action) => {
      items.loading = true;
      items.error = false;
      items.success = false;
    },
    itemUpdateReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
      items.success = true;
    },
    itemUpdateRequestFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //deleting an item
    itemDeleteRequested: (items, action) => {
      items.loading = true;
      items.error = false;
      items.success = false;
    },
    itemDeleteReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
      items.success = true;
    },
    itemDeleteFailed: (items, action) => {
      items.loading = false;
      items.error = action.payload;
    },

    //setting item availability
    itemAvailabilityRequested: (items, action) => {
      items.loading = true;
      items.error = false;
      items.success = false;
    },
    itemAvailabilityReceived: (items, action) => {
      items.item = action.payload;
      items.loading = false;
      items.success = true;
    },
    itemAvailabilityFailed: (items, action) => {
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
  itemDeleteRequested,
  itemDeleteReceived,
  itemDeleteFailed,
  itemAvailabilityRequested,
  itemAvailabilityReceived,
  itemAvailabilityFailed,
} = slice.actions;
export default slice.reducer;

//Action creators
//load items into state
export const getItemsFromDB =
  (keyword = '', pageNumber = '', flags) =>
  (dispatch, getState) => {
    try {
      return dispatch(
        apiCallBegan({
          url: `/api/v1/items?keyword=${keyword}&pageNumber=${pageNumber}`,
          method: 'get',
          headers: { ...flags },
          onStart: itemsRequested.type,
          onSuccess: itemsReceived.type,
          onError: itemsRequestFailed.type,
        })
      );
    } catch (error) {
      return error;
    }
  };

//Items Memoisation functions
//get all available items in an array
export const getItemsFromState = createSelector(
  (state) => state.entities.items.list,
  (list) => list
);

//get user's items in an array
export const getUsersItemsFromState = (userName) =>
  createSelector(
    (state) => state.entities.items.list,
    (list) =>
      list.filter((item) => {
        return item.user.name === userName;
      })
  );

//get all info in the item entity
export const getItemEntityInfo = createSelector(
  (state) => state.entities.items,
  (items) => [items.error, items.loading, items.page, items.pages]
);

//get single item info
export const getSingleItemInfo = createSelector(
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

//delete an item
export const deleteItem = (item, headers) => (dispatch) => {
  try {
    dispatch(
      apiCallBegan({
        url: `/api/v1/items/${item.itemId}/delete`,
        data: item,
        headers,
        method: 'put',
        onStart: itemDeleteRequested.type,
        onSuccess: itemDeleteReceived.type,
        onError: itemDeleteFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};

//update item availability
export const updateItemAvailability =
  (item, headers, keyword, pageNumber) => async (dispatch) => {
    try {
      await dispatch(
        apiCallBegan({
          url: `/api/v1/items/${item.itemId}/availability`,
          data: item,
          headers,
          method: 'put',
          onStart: itemAvailabilityRequested.type,
          onSuccess: itemAvailabilityReceived.type,
          onError: itemAvailabilityFailed.type,
        })
      );

      dispatch(
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
