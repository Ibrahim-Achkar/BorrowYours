import { combineReducers } from 'redux';
import itemsReducer from '../slices/itemsSlice';
import usersReducer from '../slices/usersSlice';

const entitiesReducer = combineReducers({
  items: itemsReducer,
  users: usersReducer,
});

export default entitiesReducer;
