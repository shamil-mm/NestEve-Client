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
    <div className="text-center p-4 sm:p-6 md:p-8 lg:p-10 text-white w-full">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Welcome to NestEve !</h1>
      <br />
      <p className="mb-4 sm:mb-6 text-xs sm:text-sm md:text-base">we're glad you're here! what can we help you with first ?</p>
      
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 md:gap-10">
        <div className="bg-white p-3 sm:p-4 rounded cursor-pointer hover:shadow-lg transition-shadow w-full sm:w-auto max-w-sm sm:max-w-none mx-auto sm:mx-0" onClick={onUserRegister}>
          <img 
            src={userImage}
            alt="Find Experience" 
            className="w-full h-auto max-w-[120px] sm:max-w-[150px] md:max-w-[200px] mx-auto object-contain" 
          />
          <p className="text-black font-medium mt-2 text-xs sm:text-sm md:text-base">Find an experience</p>
        </div>
        
        <div className="bg-white p-3 sm:p-4 rounded cursor-pointer hover:shadow-lg transition-shadow w-full sm:w-auto max-w-sm sm:max-w-none mx-auto sm:mx-0" onClick={onOrganizerRegister}>
          <img 
            src={organizerImage} 
            alt="Organize Event" 
            className="w-full h-auto max-w-[120px] sm:max-w-[150px] md:max-w-[200px] mx-auto object-contain" 
          />
          <p className="text-black font-medium mt-2 text-xs sm:text-sm md:text-base">Organize an event</p>
        </div>
        
      </div>

      <div className="text-center text-white my-2 sm:my-3 md:my-4 flex items-center px-4">
            <div className="flex-1 border-t border-gray-500"></div>
            <span className="px-2 sm:px-3 text-xs sm:text-sm md:text-base">OR</span>
            <div className="flex-1 border-t border-gray-500"></div>
          </div>
      <div className="px-4 sm:px-0">
        <Button variant='outline' onClick={onLogin}> Login </Button>
      </div>
      
    </div>
  );
};

export default RoleSelector;