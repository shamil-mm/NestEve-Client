import Lottie from 'lottie-react'
import success from '../../../assets/lotties/success.json'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center bg-black p-4'>
      <div className='max-w-xxl w-full'>
        <Lottie 
          animationData={success} 
          loop={true} 
          className='w-full h-64'
        />
      </div>
      
      <h1 className='text-2xl font-bold text-white mt-4 mb-2'>Payment Successful!</h1>
      <p className='text-white mb-6 text-center'>
        Your order has been placed successfully. Thank you for your purchase!
      </p>
      
      <button 
        className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                  transition-colors duration-300 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:ring-offset-2'
        onClick={() => navigate('/profile')}
      >
        View Order
      </button>
    </div>
  )
}

export default PaymentSuccess
