// components/Favourite/Favourite.jsx
import React, {useState, useEffect} from "react"
import styles from "./Favourite.module.scss"
import {ProductDetail} from "@/components/ProductDetail/ProductDetail" // Импортируем компонент
import {useNavigate} from "react-router-dom"

const Favourite = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProductType, setSelectedProductType] = useState(null)
  const navigate = useNavigate()

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
    await toggleFavorite(type, id)
    // Обновляем выбранный продукт если он открыт
    if (selectedProduct && selectedProduct.id === id) {
      const updatedProduct = favorites.find(
        (item) => item.id === id && item.type === type
      )
      setSelectedProduct(updatedProduct)
    }
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const [
          exclusivesRes,
          photographyRes,
          chefsRes,
          accommodationsRes,
          popularRes,
        ] = await Promise.all([
          fetch("http://localhost:3001/exclusives?isFavorite=true"),
          fetch("http://localhost:3001/photography?isFavorite=true"),
          fetch("http://localhost:3001/chefs?isFavorite=true"),
          fetch("http://localhost:3001/accommodations?isFavorite=true"),
          fetch("http://localhost:3001/popular?isFavorite=true"),
        ])

        const exclusives = await exclusivesRes.json()
        const photography = await photographyRes.json()
        const chefs = await chefsRes.json()
        const accommodations = await accommodationsRes.json()
        const popular = await popularRes.json()

        const exclusivesWithType = exclusives.map((item) => ({
          ...item,
          type: "exclusives",
        }))
        const photographyWithType = photography.map((item) => ({
          ...item,
          type: "photography",
        }))
        const chefsWithType = chefs.map((item) => ({...item, type: "chefs"}))
        const accommodationsWithType = accommodations.map((item) => ({
          ...item,
          type: "accommodations",
        }))
        const popularWithType = popular.map((item) => ({
          ...item,
          type: "popular",
        }))

        setFavorites([
          ...exclusivesWithType,
          ...photographyWithType,
          ...chefsWithType,
          ...accommodationsWithType,
          ...popularWithType,
        ])
        setLoading(false)
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error)
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [])

  const toggleFavorite = async (type, id) => {
    try {
      const response = await fetch(`http://localhost:3001/${type}/${id}`)
      const item = await response.json()

      const updatedItem = {...item, isFavorite: false}

      await fetch(`http://localhost:3001/${type}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      // Удаляем из локального состояния
      setFavorites((prev) =>
        prev.filter((item) => !(item.id === id && item.type === type))
      )
    } catch (error) {
      console.error("Ошибка обновления избранного:", error)
    }
  }

  const formatPrice = (price, perGuest = true) => {
    if (!price) return ""
    const priceText = `От ${price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`

    if (perGuest === undefined || perGuest === null) {
      return `${priceText}₽`
    }

    return perGuest ? `${priceText} за гостя` : `${priceText} за группу`
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>

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
        <h1>Избранное</h1>
      </header>

      {favorites.length === 0 ? (
        <div className={styles.empty}>
          <h2>В избранном пока ничего нет</h2>
          <p>Добавляйте понравившиеся предложения, нажимая на сердечко ♥</p>
        </div>
      ) : (
        <>
          <div className={styles.resultsInfo}>
            Найдено: {favorites.length} предложений
          </div>

          <div className={styles.favoritesGrid}>
            {favorites.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className={styles.favoriteCard}
                onClick={() => handleProductClick(item, item.type)} // Добавляем клик
              >
                <div className={styles.cardImage}>
                  <img
                    src={item.image}
                    alt={item.title || item.type}
                    className={styles.realImage}
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.nextSibling.style.display = "block"
                    }}
                  />
                  <div className={styles.imagePlaceholder}></div>
                  <button
                    className={`${styles.favoriteButton} ${styles.favorited}`}
                    onClick={(e) => {
                      e.stopPropagation() // Предотвращаем всплытие клика
                      toggleFavorite(item.type, item.id)
                    }}
                  >
                    {item.isFavorite ? "❤️" : "🤍"}
                  </button>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>
                    {item.title || item.type}
                  </h3>

                  {/* Для разных типов разное отображение */}
                  {item.type === "accommodations" ? (
                    <>
                      {item.city && (
                        <p className={styles.location}>
                          {item.city}, {item.location}
                        </p>
                      )}
                      <div className={styles.priceInfo}>
                        <span className={styles.price}>
                          {formatPrice(item.price, false)}
                        </span>
                        {item.nights && (
                          <span className={styles.nights}>
                            за {item.nights} ночи
                          </span>
                        )}
                      </div>
                      {item.rating && (
                        <span className={styles.rating}>★ {item.rating}</span>
                      )}
                    </>
                  ) : item.type === "popular" ? (
                    <>
                      <div className={styles.priceRating}>
                        <span className={styles.price}>
                          {formatPrice(item.price, !item.perGroup)}
                        </span>
                        {item.rating && (
                          <span className={styles.rating}>★ {item.rating}</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {item.location && (
                        <p className={styles.location}>{item.location}</p>
                      )}
                      <div className={styles.priceRating}>
                        <span className={styles.price}>
                          {formatPrice(item.price, item.perGuest)}
                        </span>
                        {item.rating && (
                          <span className={styles.rating}>★ {item.rating}</span>
                        )}
                      </div>
                      {item.minPrice && (
                        <div className={styles.minPrice}>
                          Минимальная цена:{" "}
                          {item.minPrice
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Favourite
