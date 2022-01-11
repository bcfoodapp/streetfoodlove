import {
  configureStore,
  createSlice,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { apiSlice } from "./api";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const apiErrorHandler: Middleware =
  (api: MiddlewareAPI<typeof store.dispatch, RootState>) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action)) {
      api.dispatch(setError(`api error: ${JSON.stringify(action.payload)}`));
    }
    return next(action);
  };

export const rootSlice = createSlice({
  name: "root",
  initialState: {
    error: null as string | null,
    token: null as string | null,
  },
  reducers: {
    setError: (state, { payload }: PayloadAction<string>) => {
      console.error(payload);
      state.error = payload;
    },
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    },
  },
});

export const { setError, setToken } = rootSlice.actions;

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    root: rootSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware).concat(apiErrorHandler),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
