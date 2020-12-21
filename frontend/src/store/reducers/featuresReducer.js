import { combineReducers } from 'redux';
import authReducer from '../slices/userAuth';

export default combineReducers({
  userAuth: authReducer,
});
