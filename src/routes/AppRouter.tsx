import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";

import RolePicker from "../pages/RolePicker/RolePicker";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import {ProtectedRoutes,ProtectedRoutesAdmin} from "./ProtectedRoutes";
import Login from "../pages/AdminPages/Login";
import Dashboard from "../pages/AdminPages/Dashboard";
import User from "../pages/AdminPages/User";
import Organizers from "../pages/AdminPages/Organizer";
import VerifyForgotPassword from "../pages/verifyEmail/VerifyForgotPassword";

const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/role" element={<RolePicker/>} />
            <Route path="/verify-email" element={<VerifyEmail/>} />
            <Route path='/forgot-password' element={<VerifyForgotPassword/>}/>
            <Route element={<ProtectedRoutes/>}>
           
            </Route>

      
            <Route path='/admin-login' element={<Login/>}/>

            <Route element={<ProtectedRoutesAdmin/>}>
            <Route path='/admin-dashboard' element={<Dashboard/>}/>
            <Route path='/admin-user' element={<User/>}/>
            <Route path='/admin-organizer' element={<Organizers/>}/>
            </Route>

            
        </Routes>
    </Router>
  )
}

export default AppRouter
