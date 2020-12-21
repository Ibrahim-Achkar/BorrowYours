import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './reducers/rootReducer';
import api from './middleware/apiMiddleware';

export const myStore = () => {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), api],
  });
};
