import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MarkerData, initialType } from '../types/markers';
import axios from 'axios';
import { produce, Draft } from 'immer';

const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;

const getAllMarker = createAsyncThunk(
  'marker/getMarkers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${URL}/all`);

      if (response !== undefined) {
        return thunkAPI.fulfillWithValue(response.data);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue({
        errorMessage: '마커 정보를 가져오는 데 실패했습니다.',
      });
    }
  }
);

const initialState: initialType = {
  markerData: [],
  loading: false,
  error: null,
};

const markerSlice = createSlice({
  name: 'markerData',
  initialState,
  reducers: {
    addMarker(state, action) {
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
      .addCase(getAllMarker.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getAllMarker.fulfilled, (state, { payload }) => {
        state.error = null;
        state.loading = false;
        state.markerData = payload;
      })
      .addCase(getAllMarker.rejected, (state, action) => {
        state.error =
          (action.payload as { errorMessage: string } | undefined)
            ?.errorMessage || null;
        state.loading = false;
      });
  },
});

export const { addMarker } = markerSlice.actions;
export default markerSlice.reducer;
