import { createSlice } from '@reduxjs/toolkit';
import { apiCallBegan } from '../actions/apiActions';

//Slice creator, containing reducer
const slice = createSlice({
  name: 'userAuth',
  initialState: {
    loading: false,
    error: null,
    userInfo: {},
  },
  reducers: {
    //logging in and out
    userLoginRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = null;
    },
    userLoginReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userInfo = action.payload;
    },
    userLoginFailed: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.error = action.payload;
    },
    userLogout: (userAuth, action) => {
      userAuth.userInfo = {};
    },

    //registering new user
    userRegRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = null;
    },
    userRegReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userInfo = action.payload;
    },
    userRegFailed: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.error = action.payload;
    },

    //getting logged in user details
    userInfoRequested: (userAuth, action) => {
      userAuth.loading = true;
      userAuth.error = null;
    },
    userInfoReceived: (userAuth, action) => {
      userAuth.loading = false;
      userAuth.userInfo = action.payload;
    },
    userInfoFailed: (userAuth, action) => {
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
  userInfoRequested,
  userInfoReceived,
  userInfoFailed,
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

//Getting logged in user information
// export const getUserInfo = (id) => (dispatch, getState) => {
//   const config = {
//     Authorization: 'Bearer ${}'
//   }

//   dispatch(
//     apiCallBegan({
//       url: `api/users/profile`,
//       data: { id },
//       method: 'get',
//       onStart: userInfoRequested.type,
//       onSuccess: userInfoReceived.type,
//       onError: userInfoFailed.type,
//     })
//   );
// };

export const logout = () => (dispatch) => {
  //   localStorage.removeItem('userInfo')
  return dispatch(userLogout());
};
