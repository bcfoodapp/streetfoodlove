import {
  configureStore,
  createSlice,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { apiSlice, tokenSlice } from "./api";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

interface Name {
  firstName: string;
  lastName: string;
}

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
  },
  reducers: {
    setError: (state, { payload }: PayloadAction<string>) => {
      console.error(payload);
      state.error = payload;
    },
  },
});

export const { setError } = rootSlice.actions;

export const store = configureStore({
  reducer: {
    root: rootSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [tokenSlice.name]: tokenSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Non-serializable DateTimes are allowed in API schemas only.
      serializableCheck: false,
    })
      .concat(apiSlice.middleware)
      .concat(apiErrorHandler),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
