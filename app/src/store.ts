import {configureStore, isRejectedWithValue, Middleware, MiddlewareAPI} from '@reduxjs/toolkit';
import { apiSlice } from "./api";

const errorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    throw action.payload.error;
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
