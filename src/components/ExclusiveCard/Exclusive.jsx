import React, {useState, useEffect} from "react"
import styles from "./Exclusive.module.scss"
import {useSearch} from "@/context/SearchContext"
import {ProductDetail} from "@/components/ProductDetail/ProductDetail"

export const Exclusive = () => {
  const [exclusives, setExclusives] = useState([])
  const [popular, setPopular] = useState([])
  const [filteredExclusives, setFilteredExclusives] = useState([])
  const [filteredPopular, setFilteredPopular] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [currentPopularPage, setCurrentPopularPage] = useState(1)
  const [itemsPerPage] = useState(3)
  const [popularItemsPerPage] = useState(3)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
  })
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProductType, setSelectedProductType] = useState(null)

  const {searchQuery} = useSearch()

  // Функция для открытия детального просмотра
  const handleProductClick = (product, type = "exclusives") => {
    setSelectedProduct(product)
    setSelectedProductType(type)
  }

  // Функция для закрытия детального просмотра
  const handleCloseDetail = () => {
    setSelectedProduct(null)
    setSelectedProductType(null)
  }

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exclusivesRes, popularRes] = await Promise.all([
          fetch("http://localhost:3001/exclusives"),
          fetch("http://localhost:3001/popular"),
        ])

        if (!exclusivesRes.ok || !popularRes.ok)
          throw new Error("Не удалось загрузить данные")

        const exclusivesData = await exclusivesRes.json()
        const popularData = await popularRes.json()

        setExclusives(exclusivesData)
        setFilteredExclusives(exclusivesData)
        setPopular(popularData)
        setFilteredPopular(popularData)
        setLoading(false)
      } catch (error) {
        console.error("Ошибка:", error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Переключение избранного для exclusives
  const toggleFavorite = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/exclusives/${id}`)
      const item = await response.json()

      const updatedItem = {...item, isFavorite: !item.isFavorite}

      await fetch(`http://localhost:3001/exclusives/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      setExclusives((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      )
      setFilteredExclusives((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      )
    } catch (error) {
      console.error("Ошибка обновления избранного:", error)
    }
  }

  // Переключение избранного для popular
  const toggleFavoritePopular = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/popular/${id}`)
      const item = await response.json()

      const updatedItem = {...item, isFavorite: !item.isFavorite}

      await fetch(`http://localhost:3001/popular/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      setPopular((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      )
      setFilteredPopular((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      )
    } catch (error) {
      console.error("Ошибка обновления избранного:", error)
    }
  }

  // Фильтрация данных exclusives + поиск
  useEffect(() => {
    let result = [...exclusives]

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery) ||
          item.location?.toLowerCase().includes(searchQuery) ||
          item.price?.toString().includes(searchQuery) ||
          item.rating?.toString().includes(searchQuery)
      )
    }

    if (filters.minPrice) {
      result = result.filter((item) => item.price >= parseInt(filters.minPrice))
    }

    if (filters.maxPrice) {
      result = result.filter((item) => item.price <= parseInt(filters.maxPrice))
    }

    if (filters.minRating) {
      result = result.filter(
        (item) => item.rating >= parseFloat(filters.minRating)
      )
    }

    setFilteredExclusives(result)
    setCurrentPage(1)
  }, [filters, exclusives, searchQuery])

  // Фильтрация данных popular + поиск
  useEffect(() => {
    let result = [...popular]

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery) ||
          item.price?.toString().includes(searchQuery) ||
          item.rating?.toString().includes(searchQuery)
      )
    }

    setFilteredPopular(result)
    setCurrentPopularPage(1)
  }, [popular, searchQuery])

  // Пагинация для эксклюзивов
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredExclusives.slice(
    indexOfFirstItem,
    indexOfLastItem
  )
  const totalPages = Math.ceil(filteredExclusives.length / itemsPerPage)

  // Пагинация для популярных
  const popularIndexOfLastItem = currentPopularPage * popularItemsPerPage
  const popularIndexOfFirstItem = popularIndexOfLastItem - popularItemsPerPage
  const currentPopularItems = filteredPopular.slice(
    popularIndexOfFirstItem,
    popularIndexOfLastItem
  )
  const totalPopularPages = Math.ceil(
    filteredPopular.length / popularItemsPerPage
  )

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const paginatePopular = (pageNumber) => setCurrentPopularPage(pageNumber)

  const formatPrice = (price, perGroup = false) => {
    if (!price) return "Цена не указана"
    const priceText = `От ${price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`
    return perGroup ? `${priceText} за группу` : `${priceText} за гостя`
  }

  const handleFilterChange = (e) => {
    const {name, value} = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>
  if (error) return <div className={styles.error}>Ошибка: {error}</div>

  return (
    <div className={styles.container}>
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          type={selectedProductType}
          onClose={handleCloseDetail}
          onToggleFavorite={
            selectedProductType === "exclusives"
              ? toggleFavorite
              : toggleFavoritePopular
          }
        />
      )}

      <header className={styles.header}>
        <h1>Эксклюзивы Airbnb</h1>
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
            <option value="4.5">4.5+ ★</option>
            <option value="4.0">4.0+ ★</option>
            <option value="3.5">3.5+ ★</option>
          </select>
        </div>
      </div>

      {/* Результаты */}
      <div className={styles.resultsInfo}>
        Найдено эксклюзивов: {filteredExclusives.length} предложений
        {searchQuery && filteredExclusives.length === 0 && (
          <div className={styles.noResults}>
            По запросу "{searchQuery}" в эксклюзивах ничего не найдено
          </div>
        )}
      </div>

      <section className={styles.exclusivesSection}>
        <div className={styles.exclusivesGrid}>
          {currentItems.map((item) => (
            <div
              key={item.id}
              className={styles.exclusiveCard}
              onClick={() => handleProductClick(item, "exclusives")}
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
                    e.stopPropagation()
                    toggleFavorite(item.id)
                  }}
                >
                  {item.isFavorite ? "❤️" : "🤍"}
                </button>
              </div>
              <div className={styles.cardContent}>
                <h3>{item.title}</h3>
                <p className={styles.location}>{item.location}</p>
                <div className={styles.priceRating}>
                  <span className={styles.price}>
                    {formatPrice(item.price)}
                  </span>
                  {item.rating && (
                    <span className={styles.rating}>★ {item.rating}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Пагинация для эксклюзивов */}
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

      {/* Секция с популярными предложениями */}
      <section className={styles.popularSection}>
        <h2 className={styles.sectionTitle}>Популярные впечатления</h2>
        <div className={styles.resultsInfo}>
          Найдено популярных: {filteredPopular.length} предложений
          {searchQuery && filteredPopular.length === 0 && (
            <div className={styles.noResults}>
              По запросу "{searchQuery}" в популярном ничего не найдено
            </div>
          )}
        </div>

        <div className={styles.exclusivesGrid}>
          {currentPopularItems.map((item) => (
            <div
              key={item.id}
              className={styles.exclusiveCard}
              onClick={() => handleProductClick(item, "popular")}
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
                    e.stopPropagation()
                    toggleFavoritePopular(item.id)
                  }}
                >
                  {item.isFavorite ? "❤️" : "🤍"}
                </button>
              </div>
              <div className={styles.cardContent}>
                <h3>{item.title}</h3>
                <div className={styles.priceRating}>
                  <span className={styles.price}>
                    {formatPrice(item.price, item.perGroup)}
                  </span>
                  {item.rating && (
                    <span className={styles.rating}>★ {item.rating}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация для популярных */}
        {totalPopularPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => paginatePopular(currentPopularPage - 1)}
              disabled={currentPopularPage === 1}
              className={styles.paginationButton}
            >
              ← Назад
            </button>

            {Array.from({length: totalPopularPages}, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={`popular-${page}`}
                  onClick={() => paginatePopular(page)}
                  className={`${styles.paginationButton} ${
                    currentPopularPage === page ? styles.active : ""
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => paginatePopular(currentPopularPage + 1)}
              disabled={currentPopularPage === totalPopularPages}
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
