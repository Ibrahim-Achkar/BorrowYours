import { combineReducers } from 'redux';
import entitiesReducer from './entitiesReducer';
import featuresReducer from './featuresReducer';

const rootReducer = combineReducers({
  entities: entitiesReducer,
  features: featuresReducer,
});

export default rootReducer;
