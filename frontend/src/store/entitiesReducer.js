import { combineReducers } from 'redux';
import itemsReducer from './slices/itemsSlice';
import usersReducer from './slices/usersSlice';

export default combineReducers({
  items: itemsReducer,
  users: usersReducer,
});
