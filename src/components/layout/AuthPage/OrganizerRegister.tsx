import React, { useState } from 'react';
import registerImage from '../../../assets/Flat Design Login Screen UI Concept for Mobile and Web Applications.jpeg';
import { OrganizerRegisterProps } from '../../../interfaces/IUserRegister';
import { useAppSelector } from '../../../hooks/AuthHook';
import { zodOrganizerSchema } from '../../../schemas/userSchema';
import { z } from 'zod';
import { zodErrorHandler } from '../../../error/zodErrorHandler';
import GoogleAuth from '../../common/AuthProcessLayouts/GoogleAuth';


const OrganizerRegister: React.FC<OrganizerRegisterProps> = ({ onRegister }) => {
  const { selectedRole } = useAppSelector((state) => state.auth)
   const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:"",
    role: null as 'organizer'|'user' |null,
    organizationName:''
   })
   const [error,setError]=useState<{[key:string]:string}>({})

    const hanldeSubmit=(e:React.MouseEvent<HTMLButtonElement>)=>{
      e.preventDefault()
      const FormData={...formData,role:selectedRole}
      try {
        zodOrganizerSchema.parse(FormData)
        onRegister(FormData)
        setFormData({
          name:'',
          email:'',
          password:"",
          role: null,
          organizationName:''
        })
      } catch (error) {
        if (error instanceof z.ZodError) {
             setError(zodErrorHandler(error))  
            } else {
              console.error('An unexpected error occurred:', error);
            }
      }
      
    }
  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Left side with illustration */}
      <div className="m-4 md:m-8 w-full md:w-1/2 bg-white hidden md:flex items-center justify-center">
        <img 
          src={registerImage}
          alt="Login illustration" 
          className="w-3/4"
        />
      </div>
      
      {/* Right side with login form */}
      <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-center">
        <div className="w-full">
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Name</label>
            <input 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              type="name" 
              className="w-full p-2  bg-gray-800 text-white" 
            />
             {error.name &&  <span className="text-red-500 text-sm">{error.name}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Email</label>
            <input 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email" 
              className="w-full p-2  bg-gray-800 text-white" 
            />
             {error.email &&  <span className="text-red-500 text-sm">{error.email}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Organization Name</label>
            <input 
             value={formData.organizationName}
             onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              type="organization-name" 
              className="w-full p-2  bg-gray-800 text-white" 
            />
             {error.organizationName &&  <span className="text-red-500 text-sm">{error.organizationName}</span>}
          </div>
          
          <div className="mb-6">
            <label className="block text-white text-sm mb-1">Password</label>
            <input 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type="password" 
              className="w-full p-2  bg-gray-800 text-white" 
            />
            {error.password &&  <span className="text-red-500 text-sm">{error.password}</span>}
          </div>
          
          <button 
            className="w-full bg-blue-600 text-white py-3  mb-4"
            onClick={hanldeSubmit}
          >
            Sign In
          </button>
          
          <div className="flex justify-between text-sm text-white mb-4">
            <a href="#" className="hover:underline">Don't have an account ?</a>
            <a href="#" className="hover:underline">Forgot Password ?</a>
          </div>
          
          <div className="text-center text-white my-2 flex items-center">
            <div className="flex-1 border-t border-gray-500"></div>
            <span className="px-3">OR</span>
            <div className="flex-1 border-t border-gray-500"></div>
          </div>
          
          <GoogleAuth data={selectedRole as string}/>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegister;