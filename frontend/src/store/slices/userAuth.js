import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../actions/apiActions';

//Slice creator, containing reducer
const slice = createSlice({
  name: 'userAuth',
  initialState: {
    loading: false,
    error: null,
    userLogin: {},
  },
  reducers: {
    //logging in and out
    userLoginRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = null;
    },
    userLoginReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userLogin = action.payload;
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
    },
    userRegReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userLogin = action.payload;
    },
    userRegFailed: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.error = action.payload;
    },

    //updating logged in user details
    userUpdateRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = null;
    },
    userUpdateReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userLogin = action.payload;
    },
    userUpdateFailed: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.error = action.payload;
    },
  },
});

//Exports
export const {
  userLoginRequested,
  userLoginReceived,
  userLoginFailed,
  userLogout,
  userRegRequested,
  userRegReceived,
  userRegFailed,
  // userDetailsRequested,
  // userDetailsReceived,
  // userDetailsFailed,
  userUpdateRequested,
  userUpdateReceived,
  userUpdateFailed,
} = slice.actions;
export default slice.reducer;

//Action creators

//Logging in
export const login = (email, password) => (dispatch) => {
  return dispatch(
    apiCallBegan({
      url: `api/users/login`,
      data: { email, password },
      method: 'post',
      onStart: userLoginRequested.type,
      onSuccess: userLoginReceived.type,
      onError: userLoginFailed.type,
    })
  );
};

//Registering new user
export const register = (name, email, password) => (dispatch) => {
  dispatch(
    apiCallBegan({
      url: `api/users`,
      data: { name, email, password },
      method: 'post',
      onStart: userRegRequested.type,
      onSuccess: userRegReceived.type,
      onError: userRegFailed.type,
    })
  );
};

//Getting user details by id
// export const getUserDetails = (id, headers) => (dispatch) => {
//   dispatch(
//     apiCallBegan({
//       url: `api/users/${id}`,
//       headers,
//       method: 'get',
//       onStart: userDetailsRequested.type,
//       onSuccess: userDetailsReceived.type,
//       onError: userDetailsFailed.type,
//     })
//   );
// };

//updating user
export const updateUserProfile =
  ({ id, name, email, favouriteThing, password, confirmPassword }, headers) =>
  (dispatch) => {
    dispatch(
      apiCallBegan({
        url: `/api/users/profile`,
        data: { id, name, email, favouriteThing, password, confirmPassword },
        headers,
        method: 'put',
        onStart: userUpdateRequested.type,
        onSuccess: userUpdateReceived.type,
        onError: userUpdateFailed.type,
      })
    );
  };

export const logout = () => (dispatch) => {
  return dispatch(userLogout());
};
