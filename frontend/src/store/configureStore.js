import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './topLevelReducer';
import api from './middleware/apiMiddleware';

export default function () {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware(), api],
  });
}
