import { useEffect, useState } from "react";
import bg from '../../../assets/abstract-background.jpg'
import { fetchAddress } from "../../../services/authServices";
import { useAppSelector } from "../../../hooks/AuthHook";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import {loadStripe} from '@stripe/stripe-js';
import { stripeCheckout } from "../../../services/bookingService";
import { toast } from "react-fox-toast";


export interface Address {
    _id: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zip: number;
    phone: number;
  }

const CheckoutModal = () => {

      const selectedAddressId=localStorage.getItem("selectedAddressId")
      const [address,setAddress]=useState<Address|null>(null)
      const user= useAppSelector((state) => state.authUser?.user) 
      const navigate=useNavigate()
      let {event,tickets,isSeated}=useSelector((state:RootState)=>state.checkout)
      tickets= tickets.filter((value)=>value.quantity>0)

      const publishableKey=import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    

      const [formData, setFormData] = useState({
        email: user?.email,
        phone: 0,
        streetAddress: "",
        city:"",
        state: "",
        country: "",
        zipCode: 0,
        paymentMethod: ""
      });
 
     
 

      useEffect(()=>{
        async function fetchaddress(userId:string){
            const address=await fetchAddress(userId as string)
           let selectedAddress= address.find((value:Address)=>value._id===selectedAddressId)
           setAddress(selectedAddress||null)
        }
        if(user?.id){
            fetchaddress(user?.id as string)
        }
      },[user?.id,selectedAddressId])

      useEffect(()=>{
        if(user && address){

        
         setFormData({
            email: user?.email as string,
            phone: address?.phone as number,
            streetAddress: address?.street as string,
            city:address?.city as string,
            state: address?.state as string,
            country: address?.country as string,
            zipCode: address?.zip as number,
            paymentMethod:""
          });
         
        }
       
      },[user,address])

  const handlePaymentMethodChange = (method:string) => {
    setFormData((prev) => ({
        ...prev,
        paymentMethod: method,
      }));
  };

  
  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const totalPrice = tickets.reduce((sum, ticket) => {
    // const ticketType = event.ticketTypes.find(t => t.name === ticket.name);
    return sum + (ticket.quantity * ticket.price);
  }, 0);
  const pricePerCategory=tickets.map((value)=>{
   return isSeated? value.selectedSeats?.reduce((acc,value)=>acc+Number(value.price),0):value.price
  }) 

  const handleSubmit = async(e:React.MouseEvent <HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.paymentMethod==""){
      toast.error("Pleace Select Your PaymentMethod")
      return
    }
    if(!address){
      toast.error("Pleace Provide your Address")
      return
    }
    
    // console.log('event:', event);
    // console.log('price per category',pricePerCategory);
    // console.log('tickets',tickets)


    if(formData.paymentMethod==="Strip"){
      try {
        const stripe=await loadStripe(publishableKey)
      const res=  await stripeCheckout(event,tickets,user?.id as string)
      const sessionId=res?.data.response
      if (res){
        
        const result=stripe?.redirectToCheckout({
          sessionId:sessionId
        })
      }
      } catch (error) {
        console.log(error)
      }
    }
   
    
  };

  return (

<div className="min-h-screen  flex flex-col bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>

<div className="flex  justify-center p-20">
      <div className="w-full max-w-4xl  bg-black/70 border border-blue-500  p-6 text-white ">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
     
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Billing Address */}
            <div className="flex-1 p-4 border border-white-700 ">
              
             
              
              <div className="mb-4"><h2 className="text-2xl font-bold mb-6">Billing address</h2>
                
              </div>
              <div className="mb-4">
                <label className="block mb-2">User E-mail : <br/>{formData.email}</label>
                </div> 
             
                {address ? (
                 
              
                   <div className="mb-4">
                   <label className="block mb-2">Address </label>
                
                   <div className="mb-2">
                     <label className="block mb-1 text-sm">Phone :{formData.phone}</label>
                    
                   </div>
   
                   
                   
                   <div className="mb-2">
                     <label className="block mb-1 text-sm">Street Address:{formData.streetAddress}</label>
                    
                   </div>
                   
                   <div className="mb-2">
                     <label className="block mb-1 text-sm">City : {formData.city}</label>
                    
                   </div>
                   
                   <div className="mb-2">
                     <label className="block mb-1 text-sm">State : {formData.state}</label>
                    
                   </div>
                   
                   <div className="mb-2">
                     <label className="block mb-1 text-sm">Country : {formData.country}</label>
                     
                   </div>
                   
                   <div className="mb-2">
                     <label className="block mb-1 text-sm">Zip-Code: {formData.zipCode}</label>
                     
                   </div>
                 </div>
                ):(
                <>
                
                Add your address to proceed <span className="underline text-blue-600" onClick={()=>navigate('/edit-profile')}> go to set address</span>
                </>
                )}
              
              
              {/* <div className="mt-4">
                <button className="text-blue-400 hover:text-blue-300 text-sm">Go to Address Management</button>
              </div> */}
            </div>
            
          
            <div className="flex-1 flex flex-col gap-6">
              <div className="p-4 border border-white-700 ">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                
                <div className="mb-4" id={event._id}>
                <h3 className="mb-2">{event.title}</h3>
                    <p className="mb-2">
                    <span className="font-bold">Date:</span> {new Date(event.startDate as string).toDateString()} <br />
                    <span className="font-bold">Time:</span> {event.startTime}
                    </p>
                    <p className="mb-2">
                    <span className="font-bold">Venue:</span> {event.venue} <br />
                    <span className="font-bold">Location:</span> {event.locationName}
                    </p>


                    {tickets.map((value,index)=>(
                  <div className="flex justify-between mb-1">
                        <div key={index}>
                         <span>{value.quantity} × {value.name}</span>
                        </div>
                         <span>{isSeated ? value.selectedSeats?.reduce((acc,value)=>acc+Number(value.price),0) :value.price}</span>
                 
                  </div>
                    ))}
                   
                  
                  <div className="flex justify-between mb-1">
                    
                  </div>
                  
                
                  <div className="flex justify-between font-bold">
                    <span>Total Tickets</span>
                    <span>{totalTickets}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total Price</span>
                    <span>{totalPrice}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-white-700 ">
                <h2 className="text-2xl font-bold mb-4">Pay with</h2>
                
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center w-6 h-6">
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="hidden"
                        checked={formData.paymentMethod === 'Strip'}
                        onChange={() => handlePaymentMethodChange('Strip')}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 ${formData.paymentMethod === 'Strip' ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                        {formData.paymentMethod === 'Strip' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    <span>Strip</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center w-6 h-6">
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="hidden"
                        checked={formData.paymentMethod === 'Door Ticket'}
                        onChange={() => handlePaymentMethodChange('Door Ticket')}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 ${formData.paymentMethod === 'Door Ticket' ? 'border-blue-500' : 'border-gray-400'} flex items-center justify-center`}>
                        {formData.paymentMethod === 'Door Ticket' && (
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                    <span>wallet</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-auto">
                <button
                onClick={handleSubmit}
                  type="submit"
                  className="w-full bg-transparent text-white font-bold py-3 px-6 border border-blue-500 rounded transition-colors duration-300"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
     
      </div>
      </div>
    </div>
  );

   
}

export default CheckoutModal
