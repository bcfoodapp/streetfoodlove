import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    sideBarShowing: false,
    cuisineType: [
      "mexican",
      "indian",
      "chinese",
      "japanese",
      "french",
      "spanish",
      "thai",
      "korean",
      "italian",
    ] as string[],
    priceRange: ["cheap", "medium", "gourmet"] as string[],
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
      if (payload.length === 0) {
        let defaultSelections: string[] = [
          "mexican",
          "indian",
          "chinese",
          "japanese",
          "french",
          "spanish",
          "thai",
          "korean",
          "italian",
        ];
        state.cuisineType = defaultSelections;
      } else {
        state.cuisineType = payload;
      }
    },
    addPriceRange: (state, { payload }: PayloadAction<string>) => {
      if (state.priceRange.length !== 3) {
        let tempArray = state.priceRange;
        tempArray?.push(payload);
        state.priceRange = tempArray;
      } else {
        let tempArray: string[] = [];
        tempArray?.push(payload);
        state.priceRange = tempArray;
      }
    },
    deletePriceRangeFilter: (state) => {
      let tempArray = state.priceRange;
      tempArray?.pop();
      if (tempArray.length === 0) {
        tempArray.push("cheap");
        tempArray.push("medium");
        tempArray.push("gourmet");
      }

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
