import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../../utils/firebase'
import React, { useState } from 'react'
import { Googleauth } from '../../../services/authServices'
import { toast } from 'react-fox-toast'
import { useAppDispatch } from '../../../hooks/AuthHook'
import { loginSuccess } from '../../../store/slices/authUsers'
import { useNavigate } from 'react-router-dom'
import Loading from '../Loading/Loading'

interface IGoogleAuth {
  data: string
}
const GoogleAuth: React.FC<IGoogleAuth> = ({ data }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      const userID = await result!.user.getIdToken()
      const userData = {
        userID,
        role: data
      };
      const res = await Googleauth(userData)
      console.log(res!.data.data)
      dispatch(loginSuccess(res!.data.data))
      setLoading(false)
      navigate('/')
      toast.success(res?.data.message)
    } catch (error: any) {
      setLoading(false)
      toast.error(error?.response?.data?.message)
    }finally{
      setLoading(false)
    }
  }

  if (loading) {
    return <>
      <div className="flex items-center justify-center text-white  bg-cover bg-center" >
        <div className="absolute inset-0 backdrop-blur bg-black/50"></div>
        <div className="relative right-50 bottom-40 z-10">
          <Loading />
        </div>

      </div>
    </>
  }
  return (
    <button
      className="w-full bg-gray-800 text-white py-3 flex items-center justify-center"
      onClick={handleGoogleSignIn}
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
        alt="Google"
        className="w-5 h-5 mr-2"
      />
      Continue with Google
    </button>
  )
}

export default GoogleAuth
