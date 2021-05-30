//package imports
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import localForage from 'localforage';

//app imports
import reducer from './reducers/rootReducer';
import api from './middleware/apiMiddleware';

const persistConfig = {
  key: 'root',
  storage: localForage,
  whitelist: ['features'],
  stateReconciler: autoMergeLevel1,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const myStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: { ignoredActions: ['persist/PERSIST'] },
      }),
      api,
    ],
  });
};

export default myStore;
