import { configureStore, combineReducers } from '@reduxjs/toolkit';
import markerSlice from './markerSlice';
// persist
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const reducers = combineReducers({
  markers: markerSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['markers'],
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
