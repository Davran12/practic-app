import React, {useState, useEffect} from "react"
import styles from "./Profile.module.scss"
import {useSelector} from "react-redux"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    lastName: "",
    age: "",
    phoneNumber: "",
    email: "",
  })
  const [favoritesCount, setFavoritesCount] = useState(0)

  const currentUser = useSelector((state) => state.auth.user)

  // Загрузка данных пользователя и счетчика избранного
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUser || !currentUser.id) {
          throw new Error("Пользователь не авторизован")
        }

        // Загружаем данные пользователя
        const userResponse = await fetch(
          `http://localhost:3001/users/${currentUser.id}`
        )
        if (!userResponse.ok)
          throw new Error("Не удалось загрузить данные пользователя")

        const userData = await userResponse.json()
        setUser(userData)
        setEditForm({
          name: userData.name || "",
          lastName: userData.lastName || "",
          age: userData.age || "",
          phoneNumber: userData.phoneNumber || "",
          email: userData.email || "",
        })

        // Загружаем количество избранных items из всех коллекций
        await fetchFavoritesCount(currentUser.id)

        setLoading(false)
      } catch (error) {
        console.error("Ошибка:", error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [currentUser])

  // Функция для подсчета избранного из всех коллекций
  const fetchFavoritesCount = async (userId) => {
    try {
      const collections = [
        "accommodations",
        "exclusives",
        "photography",
        "chefs",
        "popular",
      ]

      let totalFavorites = 0

      for (const collection of collections) {
        const response = await fetch(
          `http://localhost:3001/${collection}?isFavorite=true`
        )
        if (response.ok) {
          const data = await response.json()
          totalFavorites += data.length
        }
      }

      setFavoritesCount(totalFavorites)
    } catch (error) {
      console.error("Ошибка загрузки избранного:", error)
    }
  }

  // Подписка на изменения избранного (обновление каждые 3 секунды)
  useEffect(() => {
    if (!currentUser?.id) return

    const interval = setInterval(async () => {
      await fetchFavoritesCount(currentUser.id)
    }, 3000)

    return () => clearInterval(interval)
  }, [currentUser])

  // Обработка изменений в форме
  const handleInputChange = (e) => {
    const {name, value} = e.target
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Сохранение изменений
  const handleSave = async () => {
    try {
      if (!currentUser || !currentUser.id) {
        throw new Error("Пользователь не авторизован")
      }

      const response = await fetch(
        `http://localhost:3001/users/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            ...editForm,
          }),
        }
      )

      if (!response.ok) throw new Error("Не удалось обновить данные")

      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
      alert("Данные успешно обновлены!")
    } catch (error) {
      console.error("Ошибка обновления:", error)
      alert("Ошибка при обновлении данных")
    }
  }

  // Отмена редактирования
  const handleCancel = () => {
    setEditForm({
      name: user?.name || "",
      lastName: user?.lastName || "",
      age: user?.age || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  if (loading) return <div className={styles.loading}>Загрузка профиля...</div>
  if (error) return <div className={styles.error}>Ошибка: {error}</div>
  if (!user) return <div className={styles.error}>Пользователь не найден</div>

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Профиль пользователя</h1>
        {user.role === "admin" && (
          <span className={styles.adminBadge}>Администратор</span>
        )}
      </header>

      <div className={styles.profileContent}>
        {/* Аватар и основная информация */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.name?.[0]}
            {user.lastName?.[0]}
          </div>
          <div className={styles.userInfo}>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className={styles.editInput}
                  placeholder="Имя"
                />
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleInputChange}
                  className={styles.editInput}
                  placeholder="Фамилия"
                />
              </>
            ) : (
              <h2>
                {user.name} {user.lastName}
              </h2>
            )}
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleInputChange}
                className={styles.editInput}
                placeholder="Email"
              />
            ) : (
              <p className={styles.email}>{user.email}</p>
            )}
            <p className={styles.role}>
              {user.role === "admin" ? "Администратор" : "Пользователь"}
            </p>
          </div>
        </div>

        {/* Детальная информация */}
        <div className={styles.details}>
          <h3>Личная информация</h3>

          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <label>Имя</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <span>{user.name || "Не указано"}</span>
              )}
            </div>

            <div className={styles.detailItem}>
              <label>Фамилия</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editForm.lastName}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <span>{user.lastName || "Не указано"}</span>
              )}
            </div>

            <div className={styles.detailItem}>
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className={styles.editInput}
                />
              ) : (
                <span>{user.email || "Не указано"}</span>
              )}
            </div>

            <div className={styles.detailItem}>
              <label>Телефон</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={handleInputChange}
                  className={styles.editInput}
                  placeholder="+7 (XXX) XXX-XX-XX"
                />
              ) : (
                <span>{user.phoneNumber || "Не указано"}</span>
              )}
            </div>

            <div className={styles.detailItem}>
              <label>Возраст</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleInputChange}
                  className={styles.editInput}
                  min="0"
                  max="120"
                />
              ) : (
                <span>{user.age ? `${user.age} лет` : "Не указано"}</span>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className={styles.actions}>
          {isEditing ? (
            <>
              <button className={styles.saveButton} onClick={handleSave}>
                Сохранить
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                Отмена
              </button>
            </>
          ) : (
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              Редактировать профиль
            </button>
          )}
        </div>

        {/* Статистика */}
        <div className={styles.stats}>
          <h3>Статистика</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Бронирований</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{favoritesCount}</span>
              <span className={styles.statLabel}>В избранном</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Отзывов</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
