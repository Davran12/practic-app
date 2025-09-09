import {createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"

const BASE_URL = "http://localhost:3001"

export const signUp = createAsyncThunk(
  "auth/createUser",
  async function (userData, {rejectWithValue}) {
    try {
      const {data} = await axios.get(`${BASE_URL}/users`)
      const finded = data.find(
        (item) =>
          item.email === userData.email && item.password === userData.password
      )

      if (finded) {
        const message = "Такой пользователь уже существует"
        alert(message)
        throw new Error(message)
      }

      const createdUser = await axios.post(`${BASE_URL}/users`, {
        ...userData,
        role: "user",
      })

      localStorage.setItem("user-data", JSON.stringify(createdUser.data))
      return createdUser.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const signIn = createAsyncThunk(
  "auth/login",
  async function (userData, {rejectWithValue}) {
    try {
      const {data} = await axios.get(`${BASE_URL}/users`)
      const finded = data.find(
        (item) =>
          item.email === userData.email && item.password === userData.password
      )

      if (!finded) {
        const message = "Такой пользователь не найден"
        alert(message)
        throw new Error(message)
      }

      localStorage.setItem("user-data", JSON.stringify(finded))
      return finded
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)
