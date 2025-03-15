import { useNavigate, useSearchParams } from 'react-router-dom'
import bg from '../../assets/abstract-background.jpg'
import { useEffect, useRef, useState } from 'react'
import { verifyForgotPasswordToken } from '../../services/authServices'
import Button from '../../components/ui/LandingPage/Button/Button'
import { useAppDispatch } from '../../hooks/AuthHook'
import { setStep } from '../../store/slices/auth'

const VerifyForgotPassword = () => {
    const [searchParams] = useSearchParams()
    const token =searchParams.get('token')

    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const [res,setRes]=useState(null)
    const [success,setSuccess]=useState(false)
    const hasExecuted=useRef(false)
    const navigate=useNavigate()
    const dispatch = useAppDispatch()
    

    useEffect(()=>{
        if(hasExecuted.current)return
        hasExecuted.current=true
        const verifyTokenFn=async (token:string)=>{
            console.log('function executed')
            if (!token) {
                setError('No token provided. Please check your email.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true)
                const response=await verifyForgotPasswordToken(token as string)
                setLoading(false)
                console.log(response)
                setRes(response.message)
                if(!response.message){
                    throw new  Error('Token verificaion failed')
                }
                setSuccess(true)
            } catch (error:any) {
               
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        verifyTokenFn(token as string)
    },[token])


    return (
        <div className="h-screen flex items-center justify-center text-white bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="bg-black/80 w-full h-50 md:w-2/4 md:h-100 lg:w-150 xl:w-150 border border-white p-25 z-10 overflow-y-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">Email Verification for Forgot password</h2>
                <br/>
                {loading && <p className="text-center">Verifying your email...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}
                {success && <p className="text-center text-green-500">{res} <br/><br/><br/><Button variant='outline' onClick={()=>{
                    dispatch(setStep('login'));
                    navigate('/role')}
                    }>Continue</Button></p>}

            </div>
        </div>
    )
}

export default VerifyForgotPassword
