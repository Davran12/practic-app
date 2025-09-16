import React, {useState, useEffect} from "react"
import styles from "./AdminCRUD.module.scss"

const ExperiencesAdmin = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    location: "",
    image: "",
    category: "",
    rating: "",
    included: "",
    requirements: "",
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/exclusives")
      const data = await response.json()
      setItems(data)
      setLoading(false)
    } catch (error) {
      console.error("Ошибка загрузки:", error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        // Обновление существующей записи
        await fetch(`http://localhost:3001/exclusives/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Создание новой записи
        await fetch("http://localhost:3001/exclusives", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            isFavorite: false,
          }),
        })
      }
      setIsModalOpen(false)
      setEditingItem(null)
      resetForm()
      fetchItems()
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка при сохранении данных")
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title || "",
      description: item.description || "",
      price: item.price || "",
      duration: item.duration || "",
      location: item.location || "",
      image: item.image || "",
      category: item.category || "",
      rating: item.rating || "",
      included: item.included || "",
      requirements: item.requirements || "",
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить это впечатление?")) {
      try {
        await fetch(`http://localhost:3001/exclusives/${id}`, {
          method: "DELETE",
        })
        fetchItems()
        alert("Впечатление успешно удалено!")
      } catch (error) {
        console.error("Ошибка удаления:", error)
        alert("Ошибка при удалении впечатления")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      location: "",
      image: "",
      category: "",
      rating: "",
      included: "",
      requirements: "",
    })
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading)
    return <div className={styles.loading}>Загрузка впечатлений...</div>

  return (
    <div className={styles.crudContainer}>
      <div className={styles.header}>
        <h2>Управление впечатлениями</h2>
        <button
          className={styles.addButton}
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
        >
          + Добавить впечатление
        </button>
      </div>

      <div className={styles.itemsGrid}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Пока нет добавленных впечатлений</p>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={styles.card}>
              <img src={item.image} alt={item.title} />
              <div className={styles.cardContent}>
                <h3>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
                <div className={styles.details}>
                  <span>Цена: ₽{item.price}</span>
                  <span>Длительность: {item.duration}</span>
                </div>
                <div className={styles.details}>
                  <span>Место: {item.location}</span>
                  <span>Рейтинг: {item.rating}</span>
                </div>
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
            <h3>{editingItem ? "Редактировать" : "Добавить"} впечатление</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Название *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Описание *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Цена (₽) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Длительность *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="2 часа"
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
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

                <div className={styles.formGroup}>
                  <label>Рейтинг *</label>
                  <input
                    type="number"
                    name="rating"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Категория *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите категорию</option>
                  <option value="культура">Культура</option>
                  <option value="природа">Природа</option>
                  <option value="еда">Еда</option>
                  <option value="спорт">Спорт</option>
                  <option value="искусство">Искусство</option>
                  <option value="музыка">Музыка</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>URL изображения *</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Что включено</label>
                <textarea
                  name="included"
                  value={formData.included}
                  onChange={handleInputChange}
                  placeholder="Трансфер, питание, гид..."
                />
              </div>

              <div className={styles.formGroup}>
                <label>Требования</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Возрастные ограничения, физическая подготовка..."
                />
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

export default ExperiencesAdmin
