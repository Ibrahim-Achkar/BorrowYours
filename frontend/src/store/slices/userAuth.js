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
  },
});

//Exports
export const {
  userLoginRequested,
  userLoginReceived,
  userLoginFailed,
  userLogout,
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

export const logout = () => (dispatch) => {
  //   localStorage.removeItem('userInfo')
  return dispatch(userLogout());
};
