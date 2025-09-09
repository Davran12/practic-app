import {useSelector} from "react-redux"
import {Navigate, Outlet} from "react-router-dom"

export function PublicRoute() {
  const {user} = useSelector((state) => state.auth)

  return user ? <Navigate to="/" /> : <Outlet />
}
