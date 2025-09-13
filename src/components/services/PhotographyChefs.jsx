import React, {useState, useEffect} from "react"
import styles from "./PhotographyChefs.module.scss"
import {useSearch} from "@/context/SearchContext"
import {ProductDetail} from "@/components/ProductDetail/ProductDetail" // Импортируем компонент

const PhotographyChefs = () => {
  const [photography, setPhotography] = useState([])
  const [chefs, setChefs] = useState([])
  const [filteredPhotography, setFilteredPhotography] = useState([])
  const [filteredChefs, setFilteredChefs] = useState([])
  const [currentPhotoPage, setCurrentPhotoPage] = useState(1)
  const [currentChefPage, setCurrentChefPage] = useState(1)
  const [itemsPerPage] = useState(3)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    photoMinPrice: "",
    photoMaxPrice: "",
    chefMinPrice: "",
    chefMaxPrice: "",
  })
  const [selectedProduct, setSelectedProduct] = useState(null) 
  const [selectedProductType, setSelectedProductType] = useState(null)

  const {searchQuery} = useSearch()

  // Функция для открытия детального просмотра
  const handleProductClick = (product, type) => {
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
    await toggleFavorite(type, id) // Используем существующую функцию
    // Обновляем выбранный продукт если он открыт
    if (selectedProduct && selectedProduct.id === id) {
      let updatedProduct
      if (type === "photography") {
        updatedProduct = photography.find((item) => item.id === id)
      } else {
        updatedProduct = chefs.find((item) => item.id === id)
      }
      setSelectedProduct(updatedProduct)
    }
  }

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photoRes, chefsRes] = await Promise.all([
          fetch("http://localhost:3001/photography"),
          fetch("http://localhost:3001/chefs"),
        ])

        if (!photoRes.ok || !chefsRes.ok) throw new Error("Ошибка загрузки")

        const photoData = await photoRes.json()
        const chefsData = await chefsRes.json()

        setPhotography(photoData)
        setFilteredPhotography(photoData)
        setChefs(chefsData)
        setFilteredChefs(chefsData)
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
  const toggleFavorite = async (type, id) => {
    try {
      const response = await fetch(`http://localhost:3001/${type}/${id}`)
      const item = await response.json()

      const updatedItem = {...item, isFavorite: !item.isFavorite}

      await fetch(`http://localhost:3001/${type}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      // Обновляем локальное состояние
      if (type === "photography") {
        setPhotography((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        )
        setFilteredPhotography((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        )
      } else {
        setChefs((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        )
        setFilteredChefs((prev) =>
          prev.map((item) => (item.id === id ? updatedItem : item))
        )
      }
    } catch (error) {
      console.error("Ошибка обновления избранного:", error)
    }
  }

  // Фильтрация фотосъемки + поиск
  useEffect(() => {
    let result = [...photography]

    // Глобальный поиск по photography
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery) ||
          item.location?.toLowerCase().includes(searchQuery) ||
          item.price?.toString().includes(searchQuery) ||
          item.rating?.toString().includes(searchQuery)
      )
    }

    // Фильтры по цене
    if (filters.photoMinPrice) {
      result = result.filter(
        (item) => item.price >= parseInt(filters.photoMinPrice)
      )
    }

    if (filters.photoMaxPrice) {
      result = result.filter(
        (item) => item.price <= parseInt(filters.photoMaxPrice)
      )
    }

    setFilteredPhotography(result)
    setCurrentPhotoPage(1)
  }, [filters.photoMinPrice, filters.photoMaxPrice, photography, searchQuery])

  // Фильтрация поваров + поиск
  useEffect(() => {
    let result = [...chefs]

    // Глобальный поиск по chefs
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery) ||
          item.price?.toString().includes(searchQuery) ||
          item.minPrice?.toString().includes(searchQuery) ||
          item.rating?.toString().includes(searchQuery)
      )
    }

    // Фильтры по цене
    if (filters.chefMinPrice) {
      result = result.filter(
        (item) => item.price >= parseInt(filters.chefMinPrice)
      )
    }

    if (filters.chefMaxPrice) {
      result = result.filter(
        (item) => item.price <= parseInt(filters.chefMaxPrice)
      )
    }

    setFilteredChefs(result)
    setCurrentChefPage(1)
  }, [filters.chefMinPrice, filters.chefMaxPrice, chefs, searchQuery])

  // Пагинация для фотосъемки
  const photoIndexLast = currentPhotoPage * itemsPerPage
  const photoIndexFirst = photoIndexLast - itemsPerPage
  const currentPhotos = filteredPhotography.slice(
    photoIndexFirst,
    photoIndexLast
  )
  const totalPhotoPages = Math.ceil(filteredPhotography.length / itemsPerPage)

  // Пагинация для поваров
  const chefIndexLast = currentChefPage * itemsPerPage
  const chefIndexFirst = chefIndexLast - itemsPerPage
  const currentChefs = filteredChefs.slice(chefIndexFirst, chefIndexLast)
  const totalChefPages = Math.ceil(filteredChefs.length / itemsPerPage)

  const formatPrice = (price) => {
    if (!price) return ""
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  }

  const handleFilterChange = (e) => {
    const {name, value} = e.target
    setFilters((prev) => ({...prev, [name]: value}))
  }

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

      {/* Заголовок с информацией о поиске */}
      {searchQuery && (
        <div className={styles.searchHeader}>
          <h1>Результаты поиска: "{searchQuery}"</h1>
        </div>
      )}

      {/* Секция Фотосъемка */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Фотосъемка</h2>
          <div className={styles.sectionFilters}>
            <input
              type="number"
              name="photoMinPrice"
              placeholder="Мин. цена"
              value={filters.photoMinPrice}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
            <input
              type="number"
              name="photoMaxPrice"
              placeholder="Макс. цена"
              value={filters.photoMaxPrice}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
          </div>
        </div>

        <div className={styles.resultsInfo}>
          Найдено: {filteredPhotography.length} предложений
          {searchQuery && filteredPhotography.length === 0 && (
            <div className={styles.noResults}>
              По запросу "{searchQuery}" в фотосъемке ничего не найдено
            </div>
          )}
        </div>

        <div className={styles.cardsGrid}>
          {currentPhotos.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => handleProductClick(item, "photography")} // Добавляем клик
            >
              <div className={styles.cardImage}>
                <img
                  src={item.image}
                  alt={item.title}
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
                <button
                  className={`${styles.favoriteButton} ${
                    item.isFavorite ? styles.favorited : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation() // Предотвращаем всплытие клика
                    toggleFavorite("photography", item.id)
                  }}
                >
                  {item.isFavorite ? "❤️" : "🤍"}
                </button>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.location}>{item.location}</p>
                <div className={styles.priceRating}>
                  <span className={styles.price}>
                    От {formatPrice(item.price)} за гостя
                  </span>
                  {item.rating && (
                    <span className={styles.rating}>★ {item.rating}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация фотосъемки */}
        {totalPhotoPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPhotoPage(currentPhotoPage - 1)}
              disabled={currentPhotoPage === 1}
              className={styles.paginationButton}
            >
              ← Назад
            </button>

            {Array.from({length: totalPhotoPages}, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPhotoPage(page)}
                  className={`${styles.paginationButton} ${
                    currentPhotoPage === page ? styles.active : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPhotoPage(currentPhotoPage + 1)}
              disabled={currentPhotoPage === totalPhotoPages}
              className={styles.paginationButton}
            >
              Вперед →
            </button>
          </div>
        )}
      </section>

      <div className={styles.sectionDivider}></div>

      {/* Секция Повара */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Повара</h2>
          <div className={styles.sectionFilters}>
            <input
              type="number"
              name="chefMinPrice"
              placeholder="Мин. цена"
              value={filters.chefMinPrice}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
            <input
              type="number"
              name="chefMaxPrice"
              placeholder="Макс. цена"
              value={filters.chefMaxPrice}
              onChange={handleFilterChange}
              className={styles.filterInput}
            />
          </div>
        </div>

        <div className={styles.resultsInfo}>
          Найдено: {filteredChefs.length} предложений
          {searchQuery && filteredChefs.length === 0 && (
            <div className={styles.noResults}>
              По запросу "{searchQuery}" в поварах ничего не найдено
            </div>
          )}
        </div>

        <div className={styles.cardsGrid}>
          {currentChefs.map((item) => (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => handleProductClick(item, "chefs")} // Добавляем клик
            >
              <div className={styles.cardImage}>
                <img
                  src={item.image}
                  alt={item.title}
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
                <button
                  className={`${styles.favoriteButton} ${
                    item.isFavorite ? styles.favorited : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation() // Предотвращаем всплытие клика
                    toggleFavorite("chefs", item.id)
                  }}
                >
                  {item.isFavorite ? "❤️" : "🤍"}
                </button>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.priceInfo}>
                  <span className={styles.price}>
                    От {formatPrice(item.price)} за гостя
                  </span>
                  {item.minPrice && (
                    <span className={styles.minPrice}>
                      Минимальная цена: {formatPrice(item.minPrice)}
                    </span>
                  )}
                </div>
                {item.rating && (
                  <div className={styles.ratingBadge}>+ {item.rating}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация поваров */}
        {totalChefPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentChefPage(currentChefPage - 1)}
              disabled={currentChefPage === 1}
              className={styles.paginationButton}
            >
              ← Назад
            </button>

            {Array.from({length: totalChefPages}, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentChefPage(page)}
                  className={`${styles.paginationButton} ${
                    currentChefPage === page ? styles.active : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentChefPage(currentChefPage + 1)}
              disabled={currentChefPage === totalChefPages}
              className={styles.paginationButton}
            >
              Вперед →
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default PhotographyChefs
