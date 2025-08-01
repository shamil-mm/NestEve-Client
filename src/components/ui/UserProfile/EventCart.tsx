import { Star } from "lucide-react"
import { IBooking } from "../../../interfaces/Booking/IBooking"
import React, { useEffect, useState } from "react"
import { fetchSingleEvent } from "../../../services/EventServices"
import { IEvent } from "../../../interfaces/IEvent"
import {loadStripe} from '@stripe/stripe-js';
import { cancelbooking, stripeCheckout } from "../../../services/bookingService";
import { useAppSelector } from "../../../hooks/AuthHook"
import { ITicket } from "../Checkout/NonseatedCheckout"
import Swal from 'sweetalert2';


interface EventCartProps{
  booking:Partial<IBooking>
  ticketModal:(value:boolean,booking:IBooking)=>void
}
const EventCart:React.FC<EventCartProps> = ({booking,ticketModal}) => {
  const [localBooking, setLocalBooking] = useState<Partial<IBooking>>(booking);

  const [event,setEvent]=useState<IEvent|null>(null)
  const publishableKey=import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  const user= useAppSelector((state) => state.authUser?.user) 
  useEffect(()=>{
    setLocalBooking(booking)
  },[booking])

  useEffect(()=>{
    async function  getevent(){
      const eventId=localBooking?.eventId?._id
      const response=await fetchSingleEvent(eventId as string)
      setEvent(response?.data.events)
    }
    getevent()
  },[localBooking])

 


  const ticketShowfn=(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    ticketModal(true,localBooking as IBooking)
  }
  
  const handleCancelbooking=async(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()

    try {
      const result=await Swal.fire({
                  title: 'Are you sure?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, cancel it!',
                  customClass: {
                      popup: 'my-swal-popup',
                      title: 'my-swal-title',
                      htmlContainer: 'my-swal-text',
                      icon: 'my-swal-icon',
                      confirmButton: 'my-swal-confirm',
                      cancelButton: 'my-swal-cancel'
                    }
                  
                })
                if(result.isConfirmed){
                  const bookingId=(localBooking as {_id:string})._id

                 await cancelbooking({userId:user?.id as string,bookingId})
                  setLocalBooking(prev => ({
                      ...prev,
                      status: "cancelled",
                      paymentStatus: "refund",
                    }));
                  
                  await Swal.fire('Canceled!', 'Your payment has been refunded.','success')
                }

      
      
      
      
    } catch (error) {
      console.log('error froom handle cancel booking',error)
    }
  }



  const handleRetrypayment=(e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    if(localBooking.status=="pending" &&  localBooking.paymentStatus==="unpaid"){
      async function callStripe(){
      try {
      const stripe=await loadStripe(publishableKey)
      const res=  await stripeCheckout(event as IEvent,localBooking.tickets as ITicket[],user?.id as string)
      const sessionId=res?.data.response
      if (res){
        stripe?.redirectToCheckout({
          sessionId:sessionId
        })
      }
      } catch (error) {
        console.log(error)
      }
    }
    callStripe()
    }
  }
  
  return (
    <div className="rounded-lg overflow-hidden bg-black/50 border border-white/10">
      <div className="flex">
        {/* Image section */}
        <div className="relative w-1/3 h-50 min-h-[100px]">
          <img 
            src={event?.image}
            alt="Event" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute top-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
           {event?.category.categoryName}
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-xs px-2 py-1 rounded">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {new Date(event?.startDate as string).toLocaleDateString()}
          </div>
        </div>

        {/* Details section */}
        <div className="p-4 w-2/3">
          <div className="flex justify-between">
            <h3 className="font-bold text-lg">{event?.title}</h3>
            <div className="flex items-center gap-1 text-xs">
              <Star size={12} fill="yellow" stroke="yellow" />
              <span>4.8</span>
            </div>
          </div>

          <p className="text-sm text-gray-300 line-clamp-2 my-1">
            {event?.description}
          </p>

          
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <div>
             
              <div> ticket status</div>
            </div>
            <div className="text-right">
            <button className={`border-1 text-xs py-1 px-3 rounded-sm ${localBooking.status=='cancelled'? 'text-red-500':'text-green-500'}`}>{localBooking.status}</button>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <div>
             
              <div>payment status</div>
            </div>
            <div className="text-right">
            <button className="border-1 text-green-500 text-xs py-1 px-3 rounded-sm">{localBooking.paymentStatus}</button>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <div>
             
              <div>payment method</div>
            </div>
            <div className="text-right">
              <button className="border-1 text-green-500 text-xs py-1 px-3 rounded-sm">{localBooking.paymentMethod}</button>
            </div>
          </div>

          {/* <div className="flex justify-between mt-3">
            <button className="bg-green-600/30 text-green-500 text-xs py-1 px-3 rounded-full">completed</button>
            <button className="bg-yellow-600/30 text-yellow-500 text-xs py-1 px-3 rounded-full">VIP</button>
          </div> */}
                        {/* <div className="mt-3 text-sm text-white">
                <h4 className="font-semibold mb-1">Tickets</h4>
                <ul className="space-y-1">
                  {booking.tickets.map((ticket, index) => (
                    <li
                      key={index}
                      className="flex justify-between bg-white/10 p-2 rounded text-xs text-gray-200"
                    >
                      <span>{ticket.ticketType}</span>
                      <span>{ticket.quantity} × ₹{ticket.price}</span>
                    </li>
                  ))}
                </ul>
              </div> */}

          <div className="flex justify-between mt-3">
            {localBooking.status==="pending" && localBooking.paymentStatus==="unpaid" ? (<button onClick={handleRetrypayment}  className="border border-blue-600 text-xs py-1 px-3 rounded-sm">RETRY PAYMENT</button>):(localBooking.status!=="cancelled" &&( <button onClick={ticketShowfn} className="border border-blue-600 text-xs py-1 px-3 rounded-sm">TICKET VIEW</button>))}  
            {localBooking.status==="confirmed" && localBooking.paymentStatus==="paid" && (<button onClick={handleCancelbooking}  className="border-1 border-blue-600 text-xs py-1 px-3 rounded-sm">CANCEL BOOKING</button>)}  
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCart

