import {useDispatch} from "react-redux"
import {useState} from "react"

import {login} from "@/store/slices/authSlice"

import styles from "./Login.module.scss"
import axiosInstance from "@/shared/Axios/axiosinstance"

export function Login() {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const dispatch = useDispatch()

  const apiLogin = async (username, password) => {
    const response = await axiosInstance.post("auth/login", {
      username: username,
      password: password,
    })

    return response
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const data = await apiLogin(username, password)

    if (data.status === 200) {
      dispatch(login(data.data))
    }
  }

  return (
    <div className={styles.loginPage}>
      <h1>Страница авторизации</h1>
      <form onSubmit={handleSubmit}>
        <label>Логин</label>
        <input
          type="text"
          placeholder="username"
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Пароль</label>
        <input
          type="password"
          placeholder="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Авторизоваться</button>
      </form>
    </div>
  )
}
