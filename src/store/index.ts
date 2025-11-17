import { configureStore } from '@reduxjs/toolkit';
import candidatesReducer from './candidatesSlice';
import userReducer from './userSlice';
import filtersReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    candidates: candidatesReducer,
    user: userReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;