import bg from '../../../assets/abstract-background.jpg';
import CommonLogin from '../../layout/AuthPage/CommonLogin';
import RoleSelector from '../../layout/AuthPage/RoleSelector';
import UserRegister from '../../layout/AuthPage/UserRegiser';
import OrganizerRegister from '../../layout/AuthPage/OrganizerRegister';

import { useAppDispatch, useAppSelector } from '../../../hooks/AuthHook';
import { setStep, setSelectedRole } from '../../../store/slices/auth';
import { loginSuccess } from '../../../store/slices/authUsers'
import { userLogin, userRegister } from '../../../services/authServices';
import { toast } from 'react-fox-toast';
import { useState } from 'react';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';


// this for navigate through based on roles
const AuthProcessLayouts = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { step } = useAppSelector((state) => state.auth)



  const handleUserRegister = () => {
    dispatch(setSelectedRole('user'));
    dispatch(setStep('UserRegister'));
  };
  const handleOrganizerRegister = () => {
    dispatch(setSelectedRole('organizer'));
    dispatch(setStep('OrganizerRegister'));

  }
  const handleOnLogin = () => {
    dispatch(setStep('login'));
  }

  // ends here 
  const [loading, setLoading] = useState(false)


  const handlerOnLogin = async (FormData: { email: string, password: string, role: string }) => {
    try {
      setLoading(true)
      const res = await userLogin(FormData)
      dispatch(loginSuccess(res!.data.data))

      setLoading(false)
      navigate('/')
      toast.success(res?.data?.message)
    } catch (error: any) {
      setLoading(false)
      // console.log('error from auth process',error?.response?.data?.message)
      toast.error(error?.response?.data?.message)
    }
  }
  const handleRegister = async (FormData: { email: string, password: string, name: string, role: "organizer" | "user" | null }) => {
    try {
      setLoading(true)
      const res = await userRegister(FormData)
      setLoading(false)
      toast.success(res.data.message)

    } catch (error: any) {
      setLoading(false)
      toast.error(error.message)
    }
  }
  const organizerRegister = async (FormData: { email: string, password: string, name: string, role: "organizer" | "user" | null }) => {
    try {
      console.log(FormData)
      setLoading(true)
      const res = await userRegister(FormData)
      setLoading(false)
      toast.success(res.data.message)

    } catch (error: any) {
      setLoading(false)
      toast.error(error.message)
    }
  }
  if (loading) {
    return <>
      <div className="h-screen flex items-center justify-center text-white  bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0 backdrop-blur bg-black/50"></div>
        <div className="relative z-10">
          <Loading />
        </div>

      </div>
    </>
  }

  return (
    <div className="h-screen flex items-center justify-center text-white  bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="bg-black/80 h-3/4 w-4xl border-white border-1 z-1">

        {step === 'login' && (
          <CommonLogin onLogin={handlerOnLogin} />
        )}

        {step === 'role' && (
          <RoleSelector
            onLogin={handleOnLogin}
            onUserRegister={handleUserRegister}
            onOrganizerRegister={handleOrganizerRegister}
          />

        )}
        {step === 'OrganizerRegister' && (
          <OrganizerRegister onRegister={organizerRegister} />
        )}
        {step === 'UserRegister' && (
          <UserRegister onRegister={handleRegister} />
        )}


      </div>
    </div>
  );
};

export default AuthProcessLayouts;
