import {BrowserRouter, Route, Routes} from "react-router-dom"
import "./styles/global.scss"
import {MainLayout} from "./layouts/MainLayout"
import {PublicRoute} from "./routes/PublicRoute"
import {PrivateRoute} from "./routes/PrivateRoutes"
import {Provider} from "react-redux"
import {store} from "./store/store"
import {Card} from "./components/Card"
import {Auth} from "./pages/Auth"
import {Exclusive} from "./components/ExclusiveCard/Exclusive"
import PhotographyChefs from "./components/services/PhotographyChefs"
import Favourite from "./components/favourite/Favourite"
import {SearchProvider} from "./context/SearchContext"
import Profile from "./components/Profile/Profile"

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
              {/* Приватные роуты  */}
              <Route
                element={<PrivateRoute allowedRoles={["user", "admin"]} />}
              >
                <Route element={<Card />} path="/" />
                <Route element={<Exclusive />} path="/impressions" />
                <Route element={<PhotographyChefs />} path="/services" />
                <Route element={<Favourite />} path="/favourite" />
                <Route element={<p>Корзина</p>} path="/cart" />
                <Route element={<Profile />} path="/profile" />
              </Route>

              <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
                <Route element={<p>страница админа</p>} path="/admin" />
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
