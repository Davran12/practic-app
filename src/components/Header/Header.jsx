import styles from "./Header.module.scss"
import logo from "@assets/images/svg/airbnb-logo-belo-1.svg"
import homeIcon from "@assets/images/svg/house-icon.svg"
import balloonIcon from "@assets/images/svg/air.svg"
import bellIcon from "@assets/images/svg/colokol.svg"

import {NavLink, useNavigate, useLocation} from "react-router-dom"
import {useEffect, useState, useRef} from "react"
import {logout} from "@/store/slices/authSlice"
import {useDispatch, useSelector} from "react-redux"
import {useSearch} from "@/context/SearchContext"

const pages = [
  {link: "/", title: "Жильё", icon: homeIcon},
  {
    link: "/impressions",
    title: "Впечатления",
    icon: balloonIcon,
    badge: "НОВОЕ",
  },
  {link: "/services", title: "Услуги", icon: bellIcon, badge: "НОВОЕ"},
]

const burgerMenuItems = [
  {title: "Вишлисты", icon: "❤️", action: "wishlists"},
  {title: "Поездки", icon: "🏠", action: "trips"},
  {title: "Сообщения", icon: "💬", action: "messages"},
  {title: "Профиль", icon: "👤", action: "profile"},
  "divider",
  {title: "Настройки аккаунта", icon: "⚙️", action: "settings"},
  {title: "Языки и валюта", icon: "🌐", action: "language"},
  {title: "Центр помощи", icon: "❓", action: "help"},
  "divider",
  {title: "Пригласите хозяина", action: "invite-host"},
  {title: "Найти второго хозяина", action: "find-cohost"},
  "divider",
  {title: "Выйти", action: "logout"},
]

export function Header() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const {user} = useSelector((state) => state.auth)
  const [isScrolled, setIsScrolled] = useState(false)
  const {updateSearchQuery, searchQuery} = useSearch()

  // Burger menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Используем requestAnimationFrame для плавности
    let ticking = false
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", scrollHandler, {passive: true})
    return () => window.removeEventListener("scroll", scrollHandler)
  }, [])

  // закрытие по клику вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  const handleSearchChange = (e) => {
    updateSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    console.log("Search submitted:", searchQuery)
  }

  const handleMenuItemClick = (action) => {
    setIsMenuOpen(false)
    switch (action) {
      case "wishlists":
        navigate("/favourite")
        break
      case "logout":
        dispatch(logout())
        break
      case "trips":
        console.log("Переход к поездкам")
        break
      case "messages":
        console.log("Переход к сообщениям")
        break
      case "profile":
        navigate("/profile")
        break
      case "settings":
        console.log("Переход к настройкам")
        break
      case "language":
        console.log("Переход к языкам")
        break
      case "help":
        console.log("Переход в центр помощи")
        break
      case "invite-host":
        console.log("Пригласить хозяина")
        break
      case "find-cohost":
        console.log("Найти второго хозяина")
        break
      default:
        break
    }
  }

  const isHome = location.pathname === "/"

  return (
    <>
      <header
        ref={headerRef}
        className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}
      >
        <div className={styles.logoWrapper} onClick={() => navigate("/")}>
          <img src={logo} alt="airbnb-logo" />
        </div>

        <nav className={styles.nav}>
          {pages.map((page, index) => (
            <NavLink
              key={index}
              to={page.link}
              className={({isActive}) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              <img src={page.icon} alt={page.title} />
              <span>{page.title}</span>
              {page.badge && <span className={styles.badge}>{page.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <form
          className={`${styles.searchCompact} ${
            isScrolled || !isHome ? styles.visible : ""
          }`}
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            placeholder="Поиск по всем предложениям..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className={styles.searchIcon}>
            🔍
          </button>
        </form>

        <div className={styles.rightIcons}>
          <button>🌐</button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </div>

        {/* Бургер меню */}
        {isMenuOpen && (
          <div className={styles.burgerMenu} ref={menuRef}>
            <ul>
              {burgerMenuItems.map((item, idx) =>
                item === "divider" ? (
                  <hr key={idx} />
                ) : (
                  <li
                    key={idx}
                    onClick={() => handleMenuItemClick(item.action)}
                  >
                    {item.icon && (
                      <span className={styles.menuIcon}>{item.icon}</span>
                    )}
                    {item.title}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </header>

      {isHome && (
        <div
          className={`${styles.searchBar} ${isScrolled ? styles.hidden : ""}`}
        >
          <div className={styles.searchItem}>
            <span>Где</span>
            <p>Поиск направлений</p>
          </div>
          <div className={styles.searchItem}>
            <span>Прибытие</span>
            <p>Когда?</p>
          </div>
          <div className={styles.searchItem}>
            <span>Выезд</span>
            <p>Когда?</p>
          </div>
          <div className={styles.searchItem}>
            <span>Кто</span>
            <p>Кто едет?</p>
          </div>
          <button className={styles.searchBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="white"
              width="14"
              height="14"
            >
              <path d="M22 20l6 6-2 2-6-6v-1l-1-1h-1l-1-1V18l1-1h1l1 1v1zM14 22a8 8 0 110-16 8 8 0 010 16z" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
