import {configureStore, isRejectedWithValue, Middleware} from '@reduxjs/toolkit';
import { apiSlice } from "./api";

const errorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    console.error(`api error: ${JSON.stringify(action.payload)}`);
  }
  return next(action);
}

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(errorHandler),
});
