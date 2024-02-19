import { configureStore } from '@reduxjs/toolkit';
import markerSlice from './markerSlice';

const store = configureStore({
  reducer: {
    markers: markerSlice,
  },
  devTools: true,
});

export default store;
