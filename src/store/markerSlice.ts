import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { MarkerData, MarkerInfo, initialType } from '../types/markers';
import axios from 'axios';
import { produce, Draft } from 'immer';

const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}/marker`;

export const getMarker = createAsyncThunk('marker/getMarkers', async () => {
  try {
    const response = await axios.get(`${URL}/all`);

    if (response !== undefined) {
      return response.data;
    }
  } catch (error) {
    alert('예기치 못한 에러가 발생했습니다.');
    throw error;
  }
});

const initialState: initialType = {
  markerData: [],
  status: 'idle',
};

const markerSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    addMarker(state, action: PayloadAction<MarkerInfo>): void {
      state.markerData = produce(
        state.markerData,
        (draft: Draft<MarkerData>[]) => {
          draft.push(action.payload as Draft<MarkerData>);
        }
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // GET 요청의 로딩, 성공 처리
      .addCase(getMarker.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getMarker.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.markerData = action.payload;
      });
  },
});

export const { addMarker } = markerSlice.actions;
export default markerSlice.reducer;
