import {useSelector} from "react-redux"
import {Navigate, Outlet} from "react-router-dom"

export function PrivateRoute({allowedRoles}) {
  const {user} = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
