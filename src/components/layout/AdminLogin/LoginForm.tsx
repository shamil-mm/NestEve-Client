import React, { useState } from 'react'
import InputField from '../../ui/adminPage/InputField';
import AdminButton from '../../ui/adminPage/AdminButton';
import GoogleIcon from './GoogleIcon';
import { adminLogin } from '../../../services/authServices';
import { useAppDispatch } from '../../../hooks/AuthHook';
// import { loginSuccess } from '../../../store/slices/authUsers';
import { setLoginAdmin } from '../../../store/slices/authAdmin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-fox-toast';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading,setLoading]=useState(false)
    const dispatch=useAppDispatch()
    const navigate=useNavigate()
  
    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      try {
        const FormData={email,password,role:'admin'}
        setLoading(true)
        const res=await adminLogin(FormData)
        dispatch(setLoginAdmin(res!.data.data))
  
        setLoading(false)
        navigate('/admin-dashboard')
        toast.success(res?.data?.message)
      } catch (error:any) {
        setLoading(false)
        toast.error(error?.response?.data?.message)
      }
    };
    if(loading){
      return(
        <>loading</>
      )
    }
    return (
      <div className="w-4/5 max-w-md px-6 py-8">
        <div className='flex justify-center w-full'>
        <h2 className="text-blue-600 text-3xl font-bold">NestEve</h2>
        </div>
        <h1 className="text-2xl font-bold mb-8 text-center mt-6">Sign In to NestEve Admins</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <InputField 
            label="YOUR EMAIL"
            type="email"
            value={email}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
            placeholder="Enter your mail"
            required
          />
          
          <div className="relative w-full">
            <InputField 
              label="PASSWORD"
              type="password"
              value={password}
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <a href="#" className="absolute right-0 text-sm text-gray-500 hover:text-blue-600">
              Forgot your password?
            </a>
          </div>
          
          <AdminButton type="submit" text="Sign In" primary fullWidth />
          
          <div className="flex items-center text-center text-gray-500 my-4">
            <div className="flex-1 border-b border-gray-200"></div>
            <span className="px-4">Or</span>
            <div className="flex-1 border-b border-gray-200"></div>
          </div>
          
          <AdminButton 
            onClick={() => console.log('Google sign in')}
            icon={<GoogleIcon />}
            text="Sign up with Google"
            outline
            fullWidth
          />
        </form>
      </div>
    );
}

export default LoginForm
