import React, { useState } from 'react';
import registerImage from '../../../assets/Flat Design Login Screen UI Concept for Mobile and Web Applications.jpeg';
import { UserRegisterProps } from '../../../interfaces/IUserRegister';
import { zodUserSchema } from '../../../schemas/userSchema';
import {z} from 'zod'
import { zodErrorHandler } from '../../../error/zodErrorHandler';
import { useAppSelector } from '../../../hooks/AuthHook';
import GoogleAuth from '../../common/AuthProcessLayouts/GoogleAuth';

const UserRegister: React.FC<UserRegisterProps> = ({ onRegister }) => {
  const { selectedRole } = useAppSelector((state) => state.auth)
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState<{[key:string]:string}>({})
  // const [role,setRole]=

 const hanldeSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  const formData={name,email,password}
  try {
    zodUserSchema.parse(formData)
    onRegister({...formData,role:selectedRole})
    setEmail('')
    setName('')
    setPassword('')
    setError({})
  } catch (error:any) {
    if (error instanceof z.ZodError) {
     setError(zodErrorHandler(error))  
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
  
  
 }
  return (
    <div className="flex w-full h-full">
      <div className="m-8 w-1/2 bg-white flex items-center justify-center">
        <img 
          src={registerImage}
          alt="Login illustration" 
          className="w-3/4"
        />
      </div>
      {/* Right side with login form */}
      <div className="w-1/2 p-10 flex flex-col justify-center">
        <form onSubmit={hanldeSubmit} className="w-full">
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Name</label>
            <input 
              type="name" 
              className="w-full p-2  bg-gray-800 text-white" 
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
            {error.name &&  <span className="text-red-500 text-sm">{error.name}</span>}
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2  bg-gray-800 text-white" 
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            {error.email &&  <span className="text-red-500 text-sm">{error.email}</span>}
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2  bg-gray-800 text-white"
              value={password}
              onChange={(e)=>setPassword(e.target.value)} 
              autoComplete='off'
            />
            {error.password &&  <span className="text-red-500 text-sm">{error.password}</span>}
          </div>
          
          <button type='submit'
            className="w-full bg-blue-600 text-white py-3  mb-4"
          >
            Sign Up
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
        </form>
      </div>
    </div>
  );
};

export default UserRegister;