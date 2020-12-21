import { combineReducers } from 'redux';
import authReducer from '../slices/userAuth';
import { persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import localForage from 'localforage';

const userAuthConfig = {
  key: 'root',
  storage: localForage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['userInfo'],
};

const featuresReducer = combineReducers({
  userAuth: persistReducer(userAuthConfig, authReducer),
});

export default featuresReducer;
