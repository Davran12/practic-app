import {useDispatch, useSelector} from "react-redux"
import styles from "./SignUp.module.scss"
import {signUp} from "@/store/actions/actions"

export function SignUp({setHasAccount}) {
  const dispatch = useDispatch()
  const {isAuthLoading, error} = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    dispatch(signUp(data))
    e.target.reset()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1>Регистрация</h1>
      <input name="name" type="text" placeholder="name" required />
      <input name="lastName" type="text" placeholder="last name" required />
      <input name="age" type="number" placeholder="age" required />
      <input
        name="phoneNumber"
        type="text"
        placeholder="phone number"
        required
      />
      <input name="email" type="email" placeholder="email" required />
      <input name="password" type="password" placeholder="password" required />

      {error && <p className={styles.error}>{error?.message}</p>}

      <button type="button" onClick={() => setHasAccount(true)}>
        Уже есть аккаунт? Войти
      </button>
      <button className={styles.saveBtn} type="submit">
        {isAuthLoading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  )
}
