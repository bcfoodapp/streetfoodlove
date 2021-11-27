import {configureStore, createSlice, isRejectedWithValue, Middleware} from '@reduxjs/toolkit';
import { apiSlice } from "./api";

const errorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.error(`api error: ${JSON.stringify(action.payload)}`);
  }
  return next(action);
}

export const rootSlice = createSlice({
  name: 'root',
  initialState: {token: null as string | null},
  reducers: {
    setToken: (state, {payload: {token}}) => {
      state.token = token
    }
  },
});

export const {setToken} = rootSlice.actions;

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    root: rootSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(errorHandler),
});
