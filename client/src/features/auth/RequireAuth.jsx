import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation()
    const { roles } = useAuth()

    const content = (
        roles.some(roles => allowedRoles.includes(roles))    //if this is true at least once, it will return true. If we find one of roles, it will be true. allowedRoles is a parameter we pass in
            ? <Outlet />    //Outlet is all of the children, whatever we wrap this RequireAuth component around. This is to protect those routes
            : <Navigate to="/login" state={{ from: location}} replace /> //otherwise send them back to login page. Replace makes it so RequireAuth component is not in history. This will allow user to go back and not have to login again if already logged in
            //state can be used to remember the page user is trying to access. 
    )

    return content
  
}

export default RequireAuth