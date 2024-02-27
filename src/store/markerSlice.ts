import { createSlice } from '@reduxjs/toolkit';
import { MarkerData, initialType } from '../types/markers';
// import axios from 'axios';
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
    addMarker(state, action) {
      state.markerData = produce(
        state.markerData,
        (draft: Draft<MarkerData>[]) => {
          draft.push(action.payload as Draft<MarkerData>);
        }
      );
    },
  },
});

export const { setMarkers, addMarker } = markerSlice.actions;
export default markerSlice.reducer;
