import {
  configureStore,
  createSlice,
  isRejected,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
  PayloadAction,
} from "@reduxjs/toolkit";
import { apiSlice, tokenSlice } from "./api";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const apiErrorHandler: Middleware =
  (api: MiddlewareAPI<typeof store.dispatch, RootState>) =>
  (next) =>
  (action) => {
    if (isRejectedWithValue(action)) {
      let requestDetail = "";
      if ("meta" in action) {
        requestDetail = `method: ${action.meta.baseQueryMeta.request.method}, url: ${action.meta.baseQueryMeta.request.url}`;
      }
      api.dispatch(
        setError(
          `api error: ${JSON.stringify(action.payload)}, ${requestDetail}`
        )
      );
    } else if (isRejected(action)) {
      api.dispatch(setError(`api error occurred with no value`));
    }
    return next(action);
  };

export const rootSlice = createSlice({
  name: "root",
  initialState: {
    error: null as string | null,
    showError: false,
    sideBarShowing: false,
  },
  reducers: {
    setError: (state, { payload }: PayloadAction<string>) => {
      console.error(payload);
      state.error = payload;
      state.showError = true;
    },
    hideError: (state) => {
      state.showError = false;
    },
    showSideBar: (state) => {
      state.sideBarShowing = true;
    },
    hideSideBar: (state) => {
      state.sideBarShowing = false;
    },
  },
});

export const { setError, hideError, showSideBar, hideSideBar } =
  rootSlice.actions;

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
