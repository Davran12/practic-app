import React, {useState, useEffect} from "react"
import styles from "./Card.module.scss"
import {useSearch} from "@/context/SearchContext"
import {ProductDetail} from "@/components/ProductDetail/ProductDetail"

export const Card = () => {
  const [accommodations, setAccommodations] = useState([])
  const [filteredAccommodations, setFilteredAccommodations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    minRating: "",
    type: "",
  })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProductType, setSelectedProductType] = useState(null)

  const {searchQuery} = useSearch()

  // Функция для открытия детального просмотра
  const handleProductClick = (product, type = "accommodations") => {
    setSelectedProduct(product)
    setSelectedProductType(type)
  }

  // Функция для закрытия детального просмотра
  const handleCloseDetail = () => {
    setSelectedProduct(null)
    setSelectedProductType(null)
  }

  // Функция для переключения избранного из детального просмотра
  const handleToggleFavoriteFromDetail = async (type, id) => {
    await toggleFavorite(id)
    // Обновляем выбранный продукт если он открыт
    if (selectedProduct && selectedProduct.id === id) {
      const updatedProduct = accommodations.find((item) => item.id === id)
      setSelectedProduct(updatedProduct)
    }
  }

  // Функция для обновления избранного
  const updateFavorite = async (id, isFavorite) => {
    try {
      const response = await fetch(
        `http://localhost:3001/accommodations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({isFavorite}),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to update favorite")
      }

      const updatedItem = await response.json()

      return updatedItem
    } catch (error) {
      console.error("Error updating favorite:", error)
      throw error
    }
  }

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/accommodations")
        if (!response.ok) throw new Error("Не удалось загрузить данные")
        const data = await response.json()

        // Гарантируем что у каждого элемента есть isFavorite
        const dataWithFavorite = data.map((item) => ({
          ...item,
          isFavorite:
            item.isFavorite === undefined ? false : Boolean(item.isFavorite),
        }))

        setAccommodations(dataWithFavorite)
        setFilteredAccommodations(dataWithFavorite)
        setLoading(false)
      } catch (error) {
        console.error("Ошибка:", error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Переключение избранного
  const toggleFavorite = async (id) => {
    try {
      // Находим текущий элемент
      const currentItem = accommodations.find((item) => item.id === id)
      if (!currentItem) {
        console.error("Item not found:", id)
        return
      }

      const newFavoriteStatus = !currentItem.isFavorite

      // Сначала обновляем локальное состояние
      setAccommodations((prev) =>
        prev.map((item) =>
          item.id === id ? {...item, isFavorite: newFavoriteStatus} : item
        )
      )

      setFilteredAccommodations((prev) =>
        prev.map((item) =>
          item.id === id ? {...item, isFavorite: newFavoriteStatus} : item
        )
      )

      // Затем пытаемся обновить на сервере
      try {
        await updateFavorite(id, newFavoriteStatus)
      } catch (serverError) {
        console.error("Failed to update on server, reverting UI")
        // Если серверный запрос не удался, откатываем UI
        setAccommodations((prev) =>
          prev.map((item) =>
            item.id === id
              ? {...item, isFavorite: currentItem.isFavorite}
              : item
          )
        )
        setFilteredAccommodations((prev) =>
          prev.map((item) =>
            item.id === id
              ? {...item, isFavorite: currentItem.isFavorite}
              : item
          )
        )
      }
    } catch (error) {
      console.error("Error in toggleFavorite:", error)
    }
  }

  // Фильтрация данных + поиск
  useEffect(() => {
    let result = [...accommodations]

    // Глобальный поиск по всем полям
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.city && item.city.toLowerCase().includes(query)) ||
          (item.type && item.type.toLowerCase().includes(query)) ||
          (item.location && item.location.toLowerCase().includes(query)) ||
          (item.price && item.price.toString().includes(searchQuery))
      )
    }

    // Обычные фильтры
    if (filters.city) {
      const cityFilter = filters.city.toLowerCase()
      result = result.filter(
        (item) => item.city && item.city.toLowerCase().includes(cityFilter)
      )
    }

    if (filters.minPrice) {
      result = result.filter(
        (item) => item.price && item.price >= parseInt(filters.minPrice)
      )
    }

    if (filters.maxPrice) {
      result = result.filter(
        (item) => item.price && item.price <= parseInt(filters.maxPrice)
      )
    }

    if (filters.minRating) {
      result = result.filter(
        (item) => item.rating && item.rating >= parseFloat(filters.minRating)
      )
    }

    if (filters.type) {
      const typeFilter = filters.type.toLowerCase()
      result = result.filter(
        (item) => item.type && item.type.toLowerCase().includes(typeFilter)
      )
    }

    setFilteredAccommodations(result)
    setCurrentPage(1)
  }, [filters, accommodations, searchQuery])

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredAccommodations.slice(
    indexOfFirstItem,
    indexOfLastItem
  )
  const totalPages = Math.ceil(filteredAccommodations.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const formatPrice = (price) => {
    return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}₽`
  }

  const handleFilterChange = (e) => {
    const {name, value} = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Получаем уникальные города для фильтра (исключаем undefined/null)
  const uniqueCities = [
    ...new Set(
      accommodations
        .map((item) => item.city)
        .filter((city) => city != null && city !== "")
    ),
  ]

  const uniqueTypes = [
    ...new Set(
      accommodations
        .map((item) => item.type)
        .filter((type) => type != null && type !== "")
    ),
  ]

  if (loading) return <div className={styles.loading}>Загрузка...</div>
  if (error) return <div className={styles.error}>Ошибка: {error}</div>

  return (
    <div className={styles.container}>
      {/* Детальный просмотр */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          type={selectedProductType}
          onClose={handleCloseDetail}
          onToggleFavorite={handleToggleFavoriteFromDetail}
        />
      )}

      <header className={styles.header}>
        <h1>Проживание по всему миру</h1>
        {searchQuery && (
          <div className={styles.searchInfo}>
            Результаты поиска: "{searchQuery}"
          </div>
        )}
      </header>

      {/* Фильтры */}
      <div className={styles.filters}>
        <h3>Фильтры:</h3>
        <div className={styles.filterGroup}>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">Все города</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">Все типы</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="minPrice"
            placeholder="Мин. цена"
            value={filters.minPrice}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />

          <input
            type="number"
            name="maxPrice"
            placeholder="Макс. цена"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />

          <select
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <option value="">Любой рейтинг</option>
            <option value="4.9">4.9+ ★</option>
            <option value="4.8">4.8+ ★</option>
            <option value="4.7">4.7+ ★</option>
            <option value="4.5">4.5+ ★</option>
          </select>
        </div>
      </div>

      {/* Результаты */}
      <div className={styles.resultsInfo}>
        Найдено: {filteredAccommodations.length} предложений
        {searchQuery && filteredAccommodations.length === 0 && (
          <div className={styles.noResults}>
            По запросу "{searchQuery}" ничего не найдено
          </div>
        )}
      </div>

      {/* Карточки */}
      <div className={styles.accommodationsGrid}>
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={styles.accommodationCard}
            onClick={() => handleProductClick(item, "accommodations")}
          >
            <div className={styles.cardImage}>
              <img
                src={item.image}
                alt={item.type}
                className={styles.realImage}
                onError={(e) => {
                  e.target.style.display = "none"
                  e.target.nextSibling.style.display = "block"
                }}
              />
              <div
                className={styles.imagePlaceholder}
                style={{display: "none"}}
              ></div>

              {/* Кнопка избранного */}
              <button
                className={`${styles.favoriteButton} ${
                  item.isFavorite ? styles.favorited : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(item.id)
                }}
                aria-label={
                  item.isFavorite
                    ? "Удалить из избранного"
                    : "Добавить в избранное"
                }
              >
                {item.isFavorite ? "❤️" : "🤍"}
              </button>

              {item.isGuestFavorite && (
                <div className={styles.guestFavorite}>Выбор гостей</div>
              )}
            </div>

            <div className={styles.cardContent}>
              <div className={styles.titleLocation}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.location}>
                  {item.city}, {item.location}
                </span>
              </div>

              <div className={styles.priceInfo}>
                <span className={styles.price}>{formatPrice(item.price)}</span>
                <span className={styles.nights}>за {item.nights} ночи</span>
              </div>

              {item.rating && (
                <div className={styles.rating}>★ {item.rating}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            ← Назад
          </button>

          {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`${styles.paginationButton} ${
                currentPage === page ? styles.active : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Вперед →
          </button>
        </div>
      )}
    </div>
  )
}
