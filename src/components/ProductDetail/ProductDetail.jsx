import React from "react"
import styles from "./ProductDetail.module.scss"

export const ProductDetail = ({product, type, onClose, onToggleFavorite}) => {
  if (!product) return null

  const formatPrice = (price, perGroup = false) => {
    if (!price) return "Цена не указана"
    const priceText = `От ${price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`
    return perGroup ? `${priceText} за группу` : `${priceText} за гостя`
  }

  const getProductType = () => {
    switch (type) {
      case "accommodations":
        return "Проживание"
      case "exclusives":
        return "Эксклюзив"
      case "photography":
        return "Фотосъемка"
      case "chefs":
        return "Услуги повара"
      case "popular":
        return "Популярное впечатление"
      default:
        return "Предложение"
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        <div className={styles.imageSection}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.mainImage}
          />
          <button
            className={`${styles.favoriteButton} ${
              product.isFavorite ? styles.favorited : ""
            }`}
            onClick={() => onToggleFavorite(type, product.id)}
          >
            {product.isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.header}>
            <span className={styles.typeBadge}>{getProductType()}</span>
            <h1 className={styles.title}>{product.title}</h1>

            {product.location && (
              <p className={styles.location}>📍 {product.location}</p>
            )}
            {product.city && product.location && (
              <p className={styles.location}>
                📍 {product.city}, {product.location}
              </p>
            )}
          </div>

          <div className={styles.details}>
            {/* Информация о цене */}
            <div className={styles.priceSection}>
              <h3>Стоимость</h3>
              <div className={styles.price}>
                {formatPrice(product.price, product.perGroup)}
              </div>
              {product.minPrice && (
                <div className={styles.minPrice}>
                  Минимальная цена: {formatPrice(product.minPrice)}
                </div>
              )}
              {product.nights && (
                <div className={styles.nights}>за {product.nights} ночи</div>
              )}
            </div>

            {/* Рейтинг */}
            {product.rating && (
              <div className={styles.ratingSection}>
                <h3>Рейтинг</h3>
                <div className={styles.rating}>★ {product.rating}</div>
              </div>
            )}

            {/* Дополнительная информация */}
            <div className={styles.additionalInfo}>
              <h3>Описание</h3>
              <p className={styles.description}>
                {product.description ||
                  "Подробное описание отсутствует. Это уникальное предложение предоставляет незабываемые впечатления и высококачественный сервис."}
              </p>
            </div>

            {/* Особенности */}
            <div className={styles.features}>
              <h3>Особенности</h3>
              <ul>
                {product.isGuestFavorite && <li>⭐ Выбор гостей</li>}
                {type === "accommodations" && <li>🏠 {product.type}</li>}
                {product.perGroup && <li>👥 Для группы</li>}
                {product.perGuest && <li>👤 Для одного гостя</li>}
              </ul>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.bookButton}>Забронировать</button>
            <button className={styles.contactButton}>
              Связаться с хозяином
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
