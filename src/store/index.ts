import { configureStore } from '@reduxjs/toolkit';
import cafeReducer from './cafeSlice';

const store = configureStore({
  reducer: {
    cafes: cafeReducer,
  },
  devTools: true,
});

export default store;
