import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "../actions/actions";

const initialState = {
  cities: [],
  categoriesLoading: false,
  error: null,
}

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategories.pending, (state) => {
      state.categoriesLoading = true;
    });
    builder.addCase(getCategories.fulfilled, (state, { payload }) => {
      state.categoriesLoading = false;
      state.categories = payload;
    });
    builder.addCase(getCategories.rejected, (state, { payload }) => {
      state.categoriesLoading = false;
      state.error = payload;
    });
  },
});
