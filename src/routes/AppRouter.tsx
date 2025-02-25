import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage/LandingPage";
import Register from "../pages/Register/Register";
import RolePicker from "../pages/RolePicker/RolePicker";


const AppRouter = () => {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/role" element={<RolePicker/>} />
            
        </Routes>
    </Router>
  )
}

export default AppRouter
