
import { useAppSelector } from "../hooks/AuthHook"
import { Navigate,Outlet } from "react-router-dom"

export const ProtectedRoutes = () => {
  const {isAuthenticated,user}=useAppSelector((state)=>state.authUser)
  return isAuthenticated && user?.is_block===false ? <Outlet/>:<Navigate to='/role'/>
}
export const PublicRoutes=()=>{
  const {isAuthenticated}=useAppSelector((state)=>state.authUser)
  return isAuthenticated ? <Navigate to ="/"/> : <Outlet/>
}

export const ProtectedRoutesAdmin=()=>{
  const {isAuthenticated,admin}=useAppSelector((state)=>state.authAdmin)
  return isAuthenticated && admin?.role=='admin'?<Outlet/>:<Navigate to='/admin-login'/>
}
export const PublicRoutesAdmin=()=>{
  const {isAuthenticated}=useAppSelector((state)=>state.authAdmin)
  return isAuthenticated ? <Navigate to ="/admin-dashboard"/> : <Outlet/>
}



