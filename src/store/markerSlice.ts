import { createSlice } from '@reduxjs/toolkit';
import { MarkerData, initialType } from '../types/markers';
import { produce, Draft } from 'immer';

const initialState: initialType = {
  markerData: [],
};

const markerSlice = createSlice({
  name: 'markerData',
  initialState,
  reducers: {
    setMarkers(state, action) {
      state.markerData = action.payload;
    },
  },
});

export const { setMarkers } = markerSlice.actions;
export default markerSlice.reducer;
