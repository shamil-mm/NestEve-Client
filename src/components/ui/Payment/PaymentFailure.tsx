import Lottie from 'lottie-react'
import failure from '../../../assets/lotties/failure.json'
import { useNavigate } from 'react-router-dom'

const PaymentFailure = () => {
  const navigate=useNavigate()
  return (
  <div className='w-full h-screen flex flex-col items-center justify-center bg-black p-4'>
        <div className='max-w-xxl w-full'>
          <Lottie 
            animationData={failure} 
            loop={true} 
            className='w-full h-64'
          />
        </div>
        
        <h1 className='text-2xl font-bold text-white mt-4 mb-2'>Payment failed!</h1>
        <p className='text-white mb-6 text-center'>
        Your booking was created, but the payment failed.
        Please try again to confirm your booking. If the issue persists, contact support for assistance.
        </p>
        
        <button 
          className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    transition-colors duration-300 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:ring-offset-2'
                    onClick={()=>navigate('/profile')}
        >
          View Order
        </button>
      </div>
  )
}

export default PaymentFailure
