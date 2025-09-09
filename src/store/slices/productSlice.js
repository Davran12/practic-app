import {createSlice} from "@reduxjs/toolkit"

import {
  createProduct,
  deleteProduct,
  editProduct,
  getProducts,
} from "../actions/actions"

const initialState = {
  products: [],
  total: 0,
  singleProduct: null,
  productsLoading: false,
  error: null,
}

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.productsLoading = true
    })
    builder.addCase(getProducts.fulfilled, (state, {payload}) => {
      state.productsLoading = false
      state.products = payload.results
      state.total = payload.total
    })
    builder.addCase(getProducts.rejected, (state, {payload}) => {
      state.productsLoading = false
      state.error = payload
    })
    builder.addCase(createProduct.pending, (state) => {
      state.productsLoading = true
    })
    builder.addCase(createProduct.fulfilled, (state, {payload}) => {
      state.productsLoading = false
      state.singleProduct = payload
    })
    builder.addCase(createProduct.rejected, (state, {payload}) => {
      state.productsLoading = false
      state.error = payload
    })

    builder.addCase(editProduct.pending, (state) => {
      state.productsLoading = true
    })
    builder.addCase(editProduct.fulfilled, (state, {payload}) => {
      state.productsLoading = false
      state.singleProduct = payload
    })
    builder.addCase(editProduct.rejected, (state, {payload}) => {
      state.productsLoading = false
      state.error = payload
    })
    builder.addCase(deleteProduct.pending, (state) => {
      state.productsLoading = true
    })
    builder.addCase(deleteProduct.fulfilled, (state, {payload}) => {
      state.productsLoading = false
      state.singleProduct = payload
    })
    builder.addCase(deleteProduct.rejected, (state, {payload}) => {
      state.productsLoading = false
      state.error = payload
    })
  },
})
