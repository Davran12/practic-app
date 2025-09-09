import {createSlice} from "@reduxjs/toolkit"
import {signIn, signUp} from "../actions/actions"

const initialState = {
  user: JSON.parse(localStorage.getItem("user-data")) || null,
  isAuthLoading: false,
  error: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      localStorage.removeItem("user-data")
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signUp.pending, (state) => {
      state.isAuthLoading = true
    })
    builder.addCase(signUp.fulfilled, (state, {payload}) => {
      state.isAuthLoading = false
      state.user = payload
    })
    builder.addCase(signUp.rejected, (state, {payload}) => {
      state.isAuthLoading = false
      state.error = payload
    })

    builder.addCase(signIn.pending, (state) => {
      state.isAuthLoading = true
    })
    builder.addCase(signIn.fulfilled, (state, {payload}) => {
      state.isAuthLoading = false
      state.user = payload
    })
    builder.addCase(signIn.rejected, (state, {payload}) => {
      state.isAuthLoading = false
      state.error = payload
    })
  },
})

export const {login, logout} = authSlice.actions
