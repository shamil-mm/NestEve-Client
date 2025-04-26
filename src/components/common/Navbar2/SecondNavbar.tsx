import { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../ui/LandingPage/Button/Button";

// import { useNavigate } from "react-router-dom";
// import { useAppSelector, useAppDispatch } from "../../../hooks/AuthHook";
import { BellDot, Calendar, User } from 'lucide-react'
import { useNavigate } from "react-router-dom";


const SecondNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUser, setIsUser] = useState(false)
//   const dispatch = useAppDispatch()

 
  const navigate = useNavigate()
//   const { user, isAuthenticated } = useAppSelector((state) => state.authUser)
 

  return (
   
    <nav className="absolute top-0 left-0 right-0 z-50 bg-black/70 ">
      <div className="container mx-auto py-4 md:py-6 flex justify-between items-center text-white">
        {/* Logo */}
        <img src="/logo.png" alt="logo" onClick={()=>navigate('/')} className="w-28 md:w-36 lg:w-40" />

        {/* Desktop Buttons */}
        {/* {isAuthenticated ? ( */}
          <div className="hidden md:flex space-x-4 ">
            <Calendar className="mt-3 cursor-pointer" />
            <BellDot className="mt-3 cursor-pointer" />
            <User className="mt-3 cursor-pointer" onClick={() => setIsUser(!isUser)} />
            {isUser && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-27 right-5 bg-black/90 text-white shadow-lg w-60 py-5"
              >
                
              </motion.div>
            )}

            <Button variant="outline">Contact Us</Button>
          </div>
        {/* ) : (
          <div className="hidden md:flex space-x-4">
            <Button variant="outline" onClick={() => navigate('/role')}>Get Started</Button>
            <Button variant="outline">Contact Us</Button>
          </div>
        )} */}


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
         
          <div className="flex flex-col items-center mt-4 space-y-3">
            <Button variant="outline" >Get Started</Button>
            <Button variant="outline" >Contact Us</Button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default SecondNavbar;
