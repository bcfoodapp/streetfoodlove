import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    sideBarShowing: false,
    cuisineType: [] as string[],
    priceRange: [] as string[],
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
    setCuisineType: (state, { payload }: PayloadAction<string[]>) => {
      state.cuisineType = payload;
    },
    addPriceRange: (state, { payload }: PayloadAction<string>) => {
      let tempArray = state.priceRange;
      tempArray?.push(payload);
      state.priceRange = tempArray;
    },
    deletePriceRangeFilter: (state) => {
      let tempArray = state.priceRange;
      tempArray?.pop();
      state.priceRange = tempArray;
    },
  },
});

export const {
  showSideBar,
  hideSideBar,
  setSearchQuery,
  setCuisineType,
  addPriceRange,
  deletePriceRangeFilter,
} = searchSlice.actions;
