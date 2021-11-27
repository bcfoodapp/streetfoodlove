import {configureStore, isRejectedWithValue, Middleware, MiddlewareAPI} from '@reduxjs/toolkit';
import { apiSlice } from "./api";

const errorHandler: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    throw `api error: status ${action.payload.originalStatus}, data: "${action.payload.data}", error: "${action.payload.error}"`;
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
