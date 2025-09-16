import React, {useState, useEffect} from "react"
import styles from "./AdminCRUD.module.scss"

const AccommodationsAdmin = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
    rating: "",
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:3001/accommodations")
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
        await fetch(`http://localhost:3001/accommodations/${editingItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
      } else {
        // Создание новой записи
        await fetch("http://localhost:3001/accommodations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          }),
        })
      }
      setIsModalOpen(false)
      setEditingItem(null)
      setFormData({
        title: "",
        description: "",
        price: "",
        location: "",
        image: "",
        rating: "",
      })
      fetchItems()
    } catch (error) {
      console.error("Ошибка сохранения:", error)
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      price: item.price,
      location: item.location,
      image: item.image,
      rating: item.rating,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      try {
        await fetch(`http://localhost:3001/accommodations/${id}`, {
          method: "DELETE",
        })
        fetchItems()
      } catch (error) {
        console.error("Ошибка удаления:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      location: "",
      image: "",
      rating: "",
    })
    setEditingItem(null)
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>

  return (
    <div className={styles.crudContainer}>
      <div className={styles.header}>
        <h2>Управление жильем</h2>
        <button
          className={styles.addButton}
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
        >
          + Добавить жилье
        </button>
      </div>

      <div className={styles.itemsGrid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            <img src={item.image} alt={item.title} />
            <div className={styles.cardContent}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className={styles.details}>
                <span>Цена: ₽{item.price}</span>
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
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>{editingItem ? "Редактировать" : "Добавить"} жилье</h3>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Название</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({...formData, title: e.target.value})
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({...formData, description: e.target.value})
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Цена</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({...formData, price: e.target.value})
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Местоположение</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({...formData, location: e.target.value})
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>URL изображения</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({...formData, image: e.target.value})
                  }
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Рейтинг</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({...formData, rating: e.target.value})
                  }
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit">Сохранить</button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
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

export default AccommodationsAdmin
