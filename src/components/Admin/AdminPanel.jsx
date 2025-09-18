import React from "react"
import {Link, useLocation, Outlet} from "react-router-dom"
import styles from "./AdminPanel.module.scss"

const AdminPanel = () => {
  const location = useLocation()

  const tabs = [
    {path: "/admin/accommodations", label: "Жилье"},
    {path: "/admin/experiences", label: "Впечатления"},
    {path: "/admin/services", label: "Услуги"},
  ]

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <h1>Панель администратора</h1>
        <p>Управление контентом платформы</p>
      </div>

      <nav className={styles.navTabs}>
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`${styles.tab} ${
              location.pathname === tab.path ? styles.active : ""
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <div className={styles.content}>
        <Outlet /> {/* место для отображение дочерних компонентов */}
      </div>
    </div>
  )
}

export default AdminPanel
