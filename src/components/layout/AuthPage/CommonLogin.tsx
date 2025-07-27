import React, { useState } from 'react';
import loginImage from '../../../assets/loginImage.jpeg';
import { zodForgotPasswordSchema, zodLoginSchema } from '../../../schemas/userSchema';
import { z } from 'zod'
import { zodErrorHandler } from '../../../error/zodErrorHandler';
import GoogleAuth from '../../common/AuthProcessLayouts/GoogleAuth';
import ToggleButton from '../../ui/AuthUI/ToggleButton';
import { forgotPassword } from '../../../services/authServices';
import { toast } from 'react-fox-toast';


interface LoginProps {
  onLogin: (FormData: { email: string, password: string, role: string }) => void;
}


const CommonLogin: React.FC<LoginProps> = ({ onLogin }) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<{ [key: string]: string }>({})
  const [toggle, setToggle] = useState('user')
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotEmailError, setForgotEmailError] = useState<{ [key: string]: string }>({})

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const validateData = zodForgotPasswordSchema.parse({ email: forgotEmail, password: newPassword })
      console.log(validateData)

      const res = await forgotPassword(validateData)
      toast.success(res!.data.message)

      setForgotEmail('')
      setForgotEmailError({})
      setShowForgotPasswordModal(false)

    } catch (error: any) {
      if (error instanceof z.ZodError) {

        setForgotEmailError(zodErrorHandler(error))
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }

  }

  const openForgotPasswordModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowForgotPasswordModal(true)
  }

  const getToggleData = (value: string) => {
    setToggle(value)
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = { email, password, toggle }
    try {
      const verified = zodLoginSchema.parse(formData)
      onLogin({ email: verified.email, password: verified.password, role: toggle })
      setEmail('')
      setPassword('')
      setError({})

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setError(zodErrorHandler(error))
      } else {
        console.error('An unexpected error occurred:', error);
      }
    }


  }

  return (
    <>
      <div className="flex w-full h-full">

        <div className="m-8 w-1/2 bg-white hidden md:flex items-center justify-center">
          <img
            src={loginImage}
            alt="Login illustration"
            className="w-3/4 "
          />
        </div>





        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <ToggleButton data={getToggleData} />





          {toggle === 'user' ? <><div className="w-full">

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-white text-sm mb-1">Email</label>
                <input
                  type="email"
                  name='userEmail'
                  className="w-full p-2  bg-gray-800 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error.email && <span className="text-red-500 text-sm">{error.email}</span>}
              </div>
              <div className="mb-6">
                <label className="block text-white text-sm mb-1">Password</label>
                <input
                  type="password"
                  name='userPassword'
                  className="w-full p-2  bg-gray-800 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete='off'
                />
                {error.password && <span className="text-red-500 text-sm">{error.password}</span>}

              </div>

              <button
                type='submit'
                className="w-full bg-blue-600 text-white py-3  mb-4"
              >
                Sign In
              </button>

            </form>

            <div className="flex justify-between text-sm text-white mb-4">
              <a className="hover:underline"></a>
              <span onClick={openForgotPasswordModal} className="hover:underline cursor-pointer">Forgot Password ?</span>
            </div>

            <div className="text-center text-white my-2 flex items-center">
              <div className="flex-1 border-t border-gray-500"></div>
              <span className="px-3">OR</span>
              <div className="flex-1 border-t border-gray-500"></div>
            </div>
            <GoogleAuth data={toggle} />
          </div></> : <>




            <div className="w-full">
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-white text-sm mb-1">Email</label>
                  <input
                    type="email"
                    name='OrganizerEmail'
                    className="w-full p-2  bg-gray-800 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {error.email && <span className="text-red-500 text-sm">{error.email}</span>}
                </div>
                <div className="mb-6">
                  <label className="block text-white text-sm mb-1">Password</label>
                  <input
                    type="password"
                    name='OrganizerPassword'
                    className="w-full p-2  bg-gray-800 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete='off'
                  />
                  {error.password && <span className="text-red-500 text-sm">{error.password}</span>}

                </div>

                <button
                  type='submit'
                  className="w-full bg-blue-600 text-white py-3  mb-4"
                >
                  Sign In
                </button>
              </form>

              <div className="flex justify-between text-sm text-white mb-4">
                <a href="/role" className="hover:underline"></a>
                <a href="#" className="hover:underline">Forgot Password ?</a>
              </div>

              <div className="text-center text-white my-2 flex items-center">
                <div className="flex-1 border-t border-gray-500"></div>
                <span className="px-3">OR</span>
                <div className="flex-1 border-t border-gray-500"></div>
              </div>
              <GoogleAuth data={toggle} />
            </div>
          </>}




        </div>
      </div>

      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/80  flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96">
            <h2 className="text-xl text-white mb-4">Reset Password</h2>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label className="block text-white text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 bg-gray-800 text-white rounded-sm"
                  value={forgotEmail}
                  onChange={(e) => {
                    setForgotEmail(e.target.value)
                    setForgotEmailError({})
                  }}
                  placeholder="Enter email address"
                />
                {forgotEmailError.email && <span className="text-red-500 text-sm">{forgotEmailError.email}</span>}
                <br />
                
                <label className="block text-white text-sm mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full p-2 bg-gray-800 text-white rounded-sm"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setForgotEmailError({})
                  }}
                  placeholder="Enter new passward"
                />
                {forgotEmailError.password && <span className="text-red-500 text-sm">{forgotEmailError.password}</span>}
         

              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 text-white rounded-sm "
                  onClick={() => setShowForgotPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-sm"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default CommonLogin;