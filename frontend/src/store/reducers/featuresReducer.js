import { combineReducers } from 'redux';
import authReducer from '../slices/userAuth';

const featuresReducer = combineReducers({
  userAuth: authReducer,
});

export default featuresReducer;
