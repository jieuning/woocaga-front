import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CafeData, CafeInfo } from '../types/cafes';

// 더미데이터
import dummyData from '../dummy/data.json';

const cafeData: CafeData = {
  cafes: dummyData.cafes,
};

const cafeSlice = createSlice({
  name: 'cafes',
  initialState: cafeData.cafes,
  reducers: {
    // 마커 추가
    addMarker(state, action: PayloadAction<CafeInfo>) {
      state.push(action.payload);
    },
  },
});

export const { addMarker } = cafeSlice.actions;
export default cafeSlice.reducer;
