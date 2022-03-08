import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    sideBarShowing: false,
    // searchQuery is a string if user searched for the string
    searchQuery: null as string | null,
  },
  reducers: {
    showSideBar: (state) => {
      state.sideBarShowing = true;
    },
    hideSideBar: (state) => {
      state.sideBarShowing = false;
    },
    setSearchQuery: (state, { payload }: PayloadAction<string>) => {
      state.searchQuery = payload;
    },
  },
});

export const { showSideBar, hideSideBar, setSearchQuery } = searchSlice.actions;
