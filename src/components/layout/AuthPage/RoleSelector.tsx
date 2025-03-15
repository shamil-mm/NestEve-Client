import React from 'react';
import userImage from '../../../assets/userImage.jpg';
import organizerImage from '../../../assets/organizerImage.jpg';
import Button from '../../ui/LandingPage/Button/Button';
interface RoleSelectorProps {
  onLogin: () => void;
  onUserRegister: () => void;
  onOrganizerRegister: () => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onLogin,onUserRegister, onOrganizerRegister }) => {
  return (
    // <div className="min-h-screen h-screen flex items-center justify-center p-4 md:p-10">
    <div className="text-center p-4 md:p-10 text-white w-full max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold">Welcome to NestEve !</h1>
      <br />
      <p className="mb-6  text-sm md:text-base">we're glad you're here! what can we help you with first ?</p>
      
      <div className="flex flex-col md:flex-row justify-center space-y-1 md:space-y-0 md:space-x-10">
        <div className="bg-white p-4 rounded cursor-pointer hover:shadow-lg transition-shadow w-full md:w-auto" onClick={onUserRegister}>
          <img 
            src={userImage}
            alt="Find Experience" 
            className="w-full h-auto max-w-[150px] md:max-w-[200px] mx-auto object-contain" 
          />
          <p className="text-black font-medium mt-2 text-sm md:text-base">Find an experience</p>
        </div>
        
        <div className="bg-white p-4 rounded cursor-pointer hover:shadow-lg  transition-shadow" onClick={onOrganizerRegister}>
          <img 
            src={organizerImage} 
            alt="Organize Event" 
            className="w-full h-auto max-w-[150px] md:max-w-[200px] mx-auto object-contain" 
          />
          <p className="text-black font-medium mt-2 text-sm md:text-base">Organize an event</p>
        </div>
        
      </div>

      <div className="text-center text-white my-2 md:my-4 flex items-center">
            <div className="flex-1 border-t border-gray-500"></div>
            <span className="px-3 text-sm md:text-base">OR</span>
            <div className="flex-1 border-t border-gray-500"></div>
          </div>
      <Button variant='outline' onClick={onLogin}> Login </Button>
      
    </div>
    // </div>
  );
};

export default RoleSelector;