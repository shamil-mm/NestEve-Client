import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../ui/LandingPage/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/AuthHook";
import { BellDot, Calendar, User } from 'lucide-react'
import { userLogout } from "../../../services/authServices";
import { logoutSuccess } from "../../../store/slices/authUsers";
import { toast } from "react-fox-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setIsUser] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const naveItem = ["Home", "Find Events", "About"];
  const userDropdownOptions = [
    { label: "Profile", onClick: () => navigate('/profile') },
    { label: "Browse Events", onClick: () => navigate('/search-event') },
    { label: "Tickets", onClick: () => navigate('/event-tickets') },
    { label: "Notifications", onClick: () => navigate('/event-notifications') },
    { label: "Chats", onClick: () => navigate('/chats') },
    { label: "Wallet", onClick: () => navigate('/wallet') },
    { label: "Logout", onClick: () => handleLogout() },
  ];
  const handleLogout = async () => {
    try {
      dispatch(logoutSuccess())
      const res = await userLogout()
      //  console.log(res!.data!.success)
      toast.success(res!.data!.success)
      localStorage.removeItem('authUserState');
    } catch (error) {

    }
  }
  
  const { user, isAuthenticated } = useAppSelector((state) => state.authUser)
  if (user?.role == "organizer") {
    userDropdownOptions.unshift({ label: "Manage Events", onClick: () => navigate('/manage-events') })
  }

  const handleCalendar=()=>{
    navigate('/calendar') 
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-black/70 ">
      <div className="container mx-auto px-12 py-4 md:py-6 flex justify-between items-center text-white">



        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6">
          {naveItem.map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-blue-400 transition-colors">
                {item}
              </a>
            </li>
          ))}
        </ul>
        {/* Logo */}
        <img src="/logo.png" alt="logo" className="w-28 md:w-36 lg:w-40" />

        {/* Desktop Buttons */}
        {isAuthenticated ? (
          <div className="hidden md:flex space-x-4 ">
            <Calendar onClick={handleCalendar} className="mt-3 cursor-pointer" />
            <BellDot className="mt-3 cursor-pointer" />
            <User className="mt-3 cursor-pointer" onClick={() => setIsUser(!isUser)} />
            {isUser && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-27 right-5 bg-black/90 text-white shadow-lg w-60 py-5"
              >
                {userDropdownOptions.map((option) => (
                  <div
                    key={option.label}
                    onClick={option.onClick}
                    className="px-4 py-2 hover:bg-blue-400/20 cursor-pointer"
                  >
                    {option.label}
                    <hr />
                  </div>

                ))}
              </motion.div>
            )}

            <Button variant="outline">Contact Us</Button>
          </div>
        ) : (
          <div className="hidden md:flex space-x-4">
            <Button variant="outline" onClick={() => navigate('/role')}>Get Started</Button>
            <Button variant="outline">Contact Us</Button>
          </div>
        )}


        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-black text-white w-full absolute top-16 left-0 p-6 space-y-4"
        >
          <ul className="space-y-4">
            {naveItem.map((item) => (
              <li key={item}>
                <a href="#" className="block hover:text-blue-400 transition-colors">
                  {item}
                </a>
                <hr />
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center mt-4 space-y-3">
            <Button variant="outline" >Get Started</Button>
            <Button variant="outline" >Contact Us</Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;

