import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../actions/apiActions';

//Slice creator, containing reducer
const slice = createSlice({
  name: 'userAuth',
  initialState: {
    loading: false,
    error: false,
    success: false,
    userLogin: {},
  },
  reducers: {
    //fetch flags reset
    userFetchFlagsReset: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.error = false;
      userAuth.success = false;
    },

    //logging in and out
    userLoginRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = false;
      userAuth.success = false;
    },
    userLoginReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userLogin = action.payload;
      userAuth.success = true;
    },
    userLoginFailed: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.error = action.payload;
    },
    userLogout: (userAuth, action) => {
      userAuth.userLogin = {};
    },

    //registering new user
    userRegRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = null;
      userAuth.success = false;
    },
    userRegReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userLogin = action.payload;
      userAuth.success = true;
    },
    userRegFailed: (userAuth, action) => {
      userAuth.success = false;
      userAuth.loading = false;
      userAuth.error = action.payload;
    },

    //updating logged in user details
    userUpdateRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = null;
      userAuth.success = false;
    },
    userUpdateReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userLogin = action.payload;
      userAuth.success = true;
    },
    userUpdateFailed: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.success = false;
      userAuth.error = action.payload;
    },
  },
});

//Exports
export const {
  userFetchFlagsReset,
  userLoginRequested,
  userLoginReceived,
  userLoginFailed,
  userLogout,
  userRegRequested,
  userRegReceived,
  userRegFailed,
  userUpdateRequested,
  userUpdateReceived,
  userUpdateFailed,
} = slice.actions;
export default slice.reducer;

//Action creators
//Resetting fetch flags
export const resetUserAuthFlags = () => (dispatch) => {
  return dispatch(userFetchFlagsReset());
};

//Logging in
export const login = (email, password) => (dispatch) => {
  try {
    return dispatch(
      apiCallBegan({
        url: `/api/v1/users/login`,
        data: { email, password },
        method: 'post',
        onStart: userLoginRequested.type,
        onSuccess: userLoginReceived.type,
        onError: userLoginFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};

//Registering new user
export const register = (name, email, password) => (dispatch) => {
  try {
    dispatch(
      apiCallBegan({
        url: `/api/v1/users`,
        data: { name, email, password },
        method: 'post',
        onStart: userRegRequested.type,
        onSuccess: userRegReceived.type,
        onError: userRegFailed.type,
      })
    );
  } catch (error) {
    return error;
  }
};

//updating user
export const updateUserProfile =
  ({ id, name, email, favouriteThing, password, confirmPassword }, headers) =>
  (dispatch) => {
    try {
      dispatch(
        apiCallBegan({
          url: `/api/v1/users/profile`,
          data: { id, name, email, favouriteThing, password, confirmPassword },
          headers,
          method: 'put',
          onStart: userUpdateRequested.type,
          onSuccess: userUpdateReceived.type,
          onError: userUpdateFailed.type,
        })
      );
    } catch (error) {
      return error;
    }
  };

export const logout = () => (dispatch) => {
  return dispatch(userLogout());
};
