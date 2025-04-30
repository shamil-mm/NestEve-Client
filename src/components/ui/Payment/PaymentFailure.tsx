import Lottie from 'lottie-react'
import failure from '../../../assets/lotties/failure.json'
import { useNavigate } from 'react-router-dom'

const PaymentFailure = () => {
  const navigate=useNavigate()
  return (
    
       <div className='w-100 h-screen'>
          
            <Lottie animationData={failure} loop={true}/>
           
            <button className='text-blue-700 p-2  border-blue-700 border-2' onClick={()=>navigate('/')}>Back</button>

       </div>
   
  )
}

export default PaymentFailure
