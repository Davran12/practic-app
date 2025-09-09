import {useDispatch, useSelector} from "react-redux"
import styles from "./SignIn.module.scss"
import {signIn} from "@/store/actions/actions"

export function SignIn({setHasAccount}) {
  const dispatch = useDispatch()
  const {isAuthLoading, error} = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    dispatch(signIn(data))
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Вход</h1>
      <input name="email" type="email" placeholder="email" required />
      <input name="password" type="password" placeholder="password" required />

      {error && <p className={styles.error}>{error?.message}</p>}

      <button type="button" onClick={() => setHasAccount(false)}>
        Нет аккаунта? Зарегистрироваться
      </button>
      <button className={styles.saveBtn} type="submit">
        {isAuthLoading ? "Загрузка..." : "Войти"}
      </button>
    </form>
  )
}
