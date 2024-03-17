import { createSlice } from '@reduxjs/toolkit';
import { initialType } from '../types/markers';

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
    removeMarker(state, action) {
      const address = action.payload;
      state.markerData = state.markerData?.filter(
        (marker) => marker.address !== address
      );
    },
  },
});

export const { setMarkers, removeMarker } = markerSlice.actions;
export default markerSlice.reducer;
