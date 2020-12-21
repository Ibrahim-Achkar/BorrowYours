//package imports
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
//app imports
import reducer from './reducers/rootReducer';
import api from './middleware/apiMiddleware';

export const myStore = () => {
  return configureStore({
    reducer,
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: { ignoredActions: ['persist/PERSIST'] },
      }),
      api,
    ],
  });
};
