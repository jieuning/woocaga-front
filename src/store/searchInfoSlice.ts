import { createSlice } from '@reduxjs/toolkit';
import { InfoData } from '../types/markers';

interface SearchInfoState {
  info: InfoData[];
}

const initialState: SearchInfoState = {
  info: [],
};

const searchInfoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    setInfo(state, action) {
      state.info = action.payload;
    },
    deleteInfo(state) {
      state.info = [];
    },
  },
});

export const { setInfo, deleteInfo } = searchInfoSlice.actions;
export default searchInfoSlice.reducer;
