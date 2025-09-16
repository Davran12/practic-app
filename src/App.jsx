import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom"
import "./styles/global.scss"
import {MainLayout} from "./layouts/MainLayout"
import {PublicRoute} from "./routes/PublicRoute"
import {PrivateRoute} from "./routes/PrivateRoutes"
import {Provider} from "react-redux"
import {store} from "./store/store"
import {Card} from "./components/Card"
import {Auth} from "./pages/Auth"
import {Exclusive} from "./components/ExclusiveCard/Exclusive"
import PhotographyChefs from "./components/Services/PhotographyChefs"
import Favourite from "./components/Favourite/Favourite"
import {SearchProvider} from "./context/SearchContext"
import Profile from "./components/Profile/Profile"
import AdminPanel from "./components/Admin/AdminPanel"
import AccommodationsAdmin from "./components/Admin/AccommodationsAdmin"
import ExperiencesAdmin from "./components/Admin/ExperiencesAdmin"
import ServicesAdmin from "./components/Admin/ServicesAdmin"

function App() {
  return (
    <SearchProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            {/* Публичные роуты */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Auth />} />
            </Route>

            <Route element={<MainLayout />}>
              {/* Приватные роуты для пользователей и админов */}
              <Route
                element={<PrivateRoute allowedRoles={["user", "admin"]} />}
              >
                <Route path="/" element={<Card />} />
                <Route path="/impressions" element={<Exclusive />} />
                <Route path="/services" element={<PhotographyChefs />} />
                <Route path="/favourite" element={<Favourite />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Приватные роуты только для админов */}
              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                {/* Группируем админские роуты */}
                <Route path="/admin" element={<AdminPanel />}>
                  <Route
                    index
                    element={<Navigate to="accommodations" replace />}
                  />
                  <Route
                    path="accommodations"
                    element={<AccommodationsAdmin />}
                  />
                  <Route path="experiences" element={<ExperiencesAdmin />} />
                  <Route path="services" element={<ServicesAdmin />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<p>Not found</p>} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </SearchProvider>
  )
}

export default App
