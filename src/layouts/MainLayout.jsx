import {Header} from "@/components/Header"
import {Outlet} from "react-router-dom"
import styles from "./Footer.module.scss"

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          {/* Поддержка */}
          <div className={styles.column}>
            <h3>Поддержка</h3>
            <ul>
              <li>
                <a href="#">Центр помощи</a>
              </li>
              <li>
                <a href="#">Помощь: проблема с безопасностью</a>
              </li>
              <li>
                <a href="#">AirCover</a>
              </li>
              <li>
                <a href="#">Борьба с дискриминацией</a>
              </li>
              <li>
                <a href="#">Помощь людям с инвалидностью</a>
              </li>
              <li>
                <a href="#">Отмена в период пандемии</a>
              </li>
              <li>
                <a href="#">Сообщить о проблеме в районе</a>
              </li>
            </ul>
          </div>

          {/* Прием гостей */}
          <div className={styles.column}>
            <h3>Прием гостей</h3>
            <ul>
              <li>
                <a href="#">Сдайте жилье на Airbnb</a>
              </li>
              <li>
                <a href="#">AirCover для хозяев</a>
              </li>
              <li>
                <a href="#">Материалы для хозяев</a>
              </li>
              <li>
                <a href="#">Форум сообщества</a>
              </li>
              <li>
                <a href="#">Ответственный прием гостей</a>
              </li>
              <li>
                <a href="#">Бесплатный урок приема гостей</a>
              </li>
            </ul>
          </div>

          {/* Airbnb */}
          <div className={styles.column}>
            <h3>Airbnb</h3>
            <ul>
              <li>
                <a href="#">Пресс-центр</a>
              </li>
              <li>
                <a href="#">Карьера в Airbnb</a>
              </li>
              <li>
                <a href="#">Для инвесторов</a>
              </li>
              <li>
                <a href="#">Прием гостей на Airbnb.org</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <span>© 2025 Airbnb, Inc.</span>
            <a href="#">Конфиденциальность</a>
            <a href="#">Условия</a>
            <a href="#">Карта сайта</a>
            <a href="#">Реквизиты компании</a>
          </div>

          <div className={styles.bottomRight}>
            <span>🌐 Русский (RU)</span>
            <span>₽ RUB</span>
            <a href="#">Facebook</a>
            <a href="#">VK</a>
            <a href="#">X</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
