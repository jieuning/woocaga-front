import { configureStore, combineReducers } from '@reduxjs/toolkit';
// slice
import markerSlice from './markerSlice';
import searchInfoSlice from './searchInfoSlice';
import userSlice from './userSlice';
// persist
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const reducers = combineReducers({
  markers: markerSlice,
  info: searchInfoSlice,
  user: userSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['markers', 'user', 'info'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
