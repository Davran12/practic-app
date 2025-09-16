import React, {useState, useEffect} from "react"
import styles from "./AdminCRUD.module.scss"

const ServicesAdmin = () => {
  const [photographyItems, setPhotographyItems] = useState([])
  const [chefsItems, setChefsItems] = useState([])
  const [activeTab, setActiveTab] = useState("photography")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    rating: "",
    perGuest: false,
    perGroup: false,
    minPrice: "",
    image: "",
    isFavorite: false,
    category: "photography",
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      // Загружаем фотографов
      const photographyResponse = await fetch(
        "http://localhost:3001/photography"
      )
      if (!photographyResponse.ok) throw new Error("Ошибка загрузки фотографов")
      const photographyData = await photographyResponse.json()
      setPhotographyItems(photographyData)

      // Загружаем шеф-поваров
      const chefsResponse = await fetch("http://localhost:3001/chefs")
      if (!chefsResponse.ok) throw new Error("Ошибка загрузки шеф-поваров")
      const chefsData = await chefsResponse.json()
      setChefsItems(chefsData)

      setLoading(false)
    } catch (error) {
      console.error("Ошибка загрузки:", error)
      setLoading(false)
      alert("Не удалось загрузить данные")
    }
  }

  const getCurrentItems = () => {
    return activeTab === "photography" ? photographyItems : chefsItems
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const endpoint = activeTab
      const url = editingItem
        ? `http://localhost:3001/${endpoint}/${editingItem.id}`
        : `http://localhost:3001/${endpoint}`

      const method = editingItem ? "PUT" : "POST"

      // Подготовка данных для отправки
      const serviceData = {
        title: formData.title,
        price: parseInt(formData.price) || 0,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        image: formData.image,
        isFavorite: formData.isFavorite,
        id: editingItem ? editingItem.id : Date.now().toString(),
      }

      // Добавляем специфичные поля для фотографов
      if (activeTab === "photography") {
        serviceData.location = formData.location
        serviceData.perGuest = formData.perGuest
        serviceData.perGroup = formData.perGroup
        serviceData.minPrice = formData.minPrice
          ? parseInt(formData.minPrice)
          : null
      }

      // Добавляем специфичные поля для шеф-поваров
      if (activeTab === "chefs") {
        serviceData.perGuest = formData.perGuest
        serviceData.minPrice = formData.minPrice
          ? parseInt(formData.minPrice)
          : null
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) throw new Error("Ошибка сохранения")

      setIsModalOpen(false)
      setEditingItem(null)
      resetForm()
      fetchItems()
      alert(editingItem ? "Услуга обновлена!" : "Услуга создана!")
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка при сохранении услуги")
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title || "",
      location: item.location || "",
      price: item.price?.toString() || "",
      rating: item.rating?.toString() || "",
      perGuest: item.perGuest || false,
      perGroup: item.perGroup || false,
      minPrice: item.minPrice?.toString() || "",
      image: item.image || "",
      isFavorite: item.isFavorite || false,
      category: activeTab,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту услугу?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/${activeTab}/${id}`,
          {
            method: "DELETE",
          }
        )

        if (!response.ok) throw new Error("Ошибка удаления")

        fetchItems()
        alert("Услуга успешно удалена!")
      } catch (error) {
        console.error("Ошибка удаления:", error)
        alert("Ошибка при удалении услуги")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      price: "",
      rating: "",
      perGuest: false,
      perGroup: false,
      minPrice: "",
      image: "",
      isFavorite: false,
      category: activeTab,
    })
  }

  const handleInputChange = (e) => {
    const {name, value, type, checked} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  if (loading) return <div className={styles.loading}>Загрузка услуг...</div>

  const currentItems = getCurrentItems()

  return (
    <div className={styles.crudContainer}>
      <div className={styles.header}>
        <h2>Управление услугами</h2>
        <button
          className={styles.addButton}
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
        >
          + Добавить услугу
        </button>
      </div>

      {/* Табы для переключения между фотографами и шеф-поварами */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "photography" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("photography")}
        >
          Фотографы
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "chefs" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("chefs")}
        >
          Шеф-повара
        </button>
      </div>

      <div className={styles.itemsGrid}>
        {currentItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Пока нет добавленных услуг в этой категории</p>
            <button
              className={styles.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              Добавить первую услугу
            </button>
          </div>
        ) : (
          currentItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <img src={item.image} alt={item.title} />
              <div className={styles.cardContent}>
                <h3>{item.title}</h3>

                {item.location && (
                  <p className={styles.location}>📍 {item.location}</p>
                )}

                <div className={styles.details}>
                  <span>Цена: ₽{item.price}</span>
                  <span>Рейтинг: {item.rating || "Нет оценок"}</span>
                </div>

                <div className={styles.details}>
                  {item.perGuest && <span>За гостя</span>}
                  {item.perGroup && <span>За группу</span>}
                  {item.minPrice && <span>Мин. цена: ₽{item.minPrice}</span>}
                </div>

                {item.isFavorite && (
                  <div className={styles.favoriteBadge}>❤️ В избранном</div>
                )}

                <div className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(item)}
                  >
                    Редактировать
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>
              {editingItem ? "Редактировать" : "Добавить"}{" "}
              {activeTab === "photography" ? "фотографа" : "шеф-повара"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Название услуги *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {activeTab === "photography" && (
                <div className={styles.formGroup}>
                  <label>Местоположение *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Цена (₽) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Рейтинг (0-5)</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {activeTab === "photography" && (
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>
                      <input
                        type="checkbox"
                        name="perGuest"
                        checked={formData.perGuest}
                        onChange={handleInputChange}
                      />
                      За гостя
                    </label>
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      <input
                        type="checkbox"
                        name="perGroup"
                        checked={formData.perGroup}
                        onChange={handleInputChange}
                      />
                      За группу
                    </label>
                  </div>
                </div>
              )}

              {activeTab === "chefs" && (
                <div className={styles.formGroup}>
                  <label>
                    <input
                      type="checkbox"
                      name="perGuest"
                      checked={formData.perGuest}
                      onChange={handleInputChange}
                    />
                    За гостя
                  </label>
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Минимальная цена ($)</label>
                <input
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label>URL изображения *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>
                  <input
                    type="checkbox"
                    name="isFavorite"
                    checked={formData.isFavorite}
                    onChange={handleInputChange}
                  />
                  В избранном
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="submit">
                  {editingItem ? "Обновить" : "Создать"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingItem(null)
                    resetForm()
                  }}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServicesAdmin
