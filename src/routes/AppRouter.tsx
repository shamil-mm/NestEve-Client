import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";

import RolePicker from "../pages/RolePicker/RolePicker";
import VerifyEmail from "../pages/verifyEmail/VerifyEmail";
import {PublicRoutes ,ProtectedRoutes,ProtectedRoutesAdmin, PublicRoutesAdmin} from "./ProtectedRoutes";
import Login from "../pages/AdminPages/Login";
import Dashboard from "../pages/AdminPages/Dashboard";
import User from "../pages/AdminPages/User";
import Organizers from "../pages/AdminPages/Organizer";
import VerifyForgotPassword from "../pages/verifyEmail/VerifyForgotPassword";
import EditUserProfile from "../pages/UserProfile/EditUserProfile";
import UserProfile from "../pages/UserProfile/UserProfile";
import ManageEvents from "../pages/ManageEvents/ManageEvents";
import Tags from "../pages/AdminPages/Tags";
import Category from "../pages/AdminPages/Category";
import Events from "../pages/AdminPages/Events";
import BrowseEvent from "../pages/BrowseEvent/BrowseEvent";

const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route element={<PublicRoutes/>}>
            <Route path="/role" element={<RolePicker/>} />
            <Route path="/verify-email" element={<VerifyEmail/>} />
            <Route path='/forgot-password' element={<VerifyForgotPassword/>}/>
            </Route>
            <Route element={<ProtectedRoutes/>}>
            <Route path='/profile' element={<UserProfile/>}></Route>
            <Route path='/edit-profile' element={<EditUserProfile/>}></Route>
            <Route path='/manage-events' element={<ManageEvents/>}></Route>
            <Route path='/search-event' element={<BrowseEvent/>}></Route>
            </Route>

            <Route element={<PublicRoutesAdmin/>}>
            <Route path='/admin-login' element={<Login/>}/>
            </Route>

            <Route element={<ProtectedRoutesAdmin/>}>
            <Route path='/admin-dashboard' element={<Dashboard/>}/>
            <Route path='/admin-user' element={<User/>}/>
            <Route path='/admin-organizer' element={<Organizers/>}/>
            <Route path='/admin-tags' element={<Tags/>}/>
            <Route path='/admin-category' element={<Category/>}/>
            <Route path='/admin-events' element={<Events/>}/>

            </Route>

            
        </Routes>
    </Router>
  )
}

export default AppRouter
