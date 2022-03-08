import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    sideBarShowing: false,
    // searchQuery is the string that the user searched for. It is null if the user did not search.
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
