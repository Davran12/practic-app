import axios from "axios"

const axiosInstance = axios.create()

const baseURL = import.meta.env.VITE_API_URL

axiosInstance.defaults.baseURL = baseURL

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers["Content-Type"] = "application/json"
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance
