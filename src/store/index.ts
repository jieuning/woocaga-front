import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './markerSlice';

const store = configureStore({
  reducer: {
    markers: markerReducer,
  },
  devTools: true,
});

export default store;
