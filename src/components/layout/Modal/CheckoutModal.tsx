import { useState } from "react";
import bg from '../../../assets/abstract-background.jpg'
import { useAppSelector } from "../../../hooks/AuthHook";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { stripeCheckout } from "../../../services/bookingService";
import { toast } from "react-fox-toast";
import Swal from "sweetalert2";


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
  const user = useAppSelector((state) => state.authUser?.user)
  const navigate = useNavigate()
  let { event, tickets, isSeated } = useSelector((state: RootState) => state.checkout)


  tickets = tickets.filter((value) => value.quantity > 0)

  const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY


  const [formData, setFormData] = useState({
    email: user?.email,
    phone: 0,
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    zipCode: 0,
    paymentMethod: ""
  });








  const handlePaymentMethodChange = (method: string) => {
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
  // const pricePerCategory=tickets.map((value)=>{
  //  return isSeated? value.selectedSeats?.reduce((acc,value)=>acc+Number(value.price),0):value.price
  // }) 

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formData.paymentMethod == "") {
      toast.error("Pleace Select Your PaymentMethod")
      return
    }

    if (formData.paymentMethod === "Strip") {
      try {

        const stripe = await loadStripe(publishableKey)
        const res = await stripeCheckout({ ...event, is_seated: isSeated }, tickets, user?.id as string)
        console.log('testing someone is processing message', res?.data)
        const sessionId = res?.data.response
        if (res?.data.response === "Some one is processing") {
          console.log('it comming inside')
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Someone is already processing this booking. Please try again shortly.',
          }).then((result) => {
            console.log(result ,"in then state")
            if (result.isConfirmed) {
              navigate("/search-event");
            }
          });
        } else {
          stripe?.redirectToCheckout({
            sessionId: sessionId
          })
        }
      } catch (error: any) {
        console.log(error)
        //  const msg = error?.message || "";

        //   const match = msg.match(/You specified '(.*)'/);
        //   const extractedMessage = match?.[1];

        //   if (extractedMessage == "Some one is processing") {
        //      Swal.fire({
        //         icon: 'error',
        //         title: 'Oops!',
        //         text: 'Someone is already processing this booking. Please try again shortly.',
        //       });
        //       navigate("/search-event")
        //   }
      }
    }


  };

  return (

    <div className="min-h-screen  flex flex-col bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>

      <div className="flex  justify-center p-20">
        <div className="w-full max-w-4xl  bg-black/70 border border-blue-500  p-6 text-white ">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

          <div className="flex flex-col md:flex-row gap-6">



            <div className="flex-1 flex flex-col gap-6">
              <div className="p-4 border border-white-700 ">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                <div className="mb-4" id={event._id}>
                  <h3 className="mb-2">{event.title}</h3>
                  <p className="mb-2">
                    <span className="font-bold">Date:</span> {new Date(event.startDate as string).toDateString()} <br />
                    <span className="font-bold">Time:</span> {event.startTime}
                  </p>
                  {/* <p className="mb-2">
                    <span className="font-bold">Venue:</span> {event.venue} <br />
                    <span className="font-bold">Location:</span> {event.locationName}
                    </p> */}


                  {tickets.map((value, index) => (
                    <div className="flex justify-between mb-1">
                      <div key={index}>
                        <span>{value.quantity} × {value.name}</span>
                      </div>
                      <span>{isSeated ? value.selectedSeats?.reduce((acc, value) => acc + Number(value.price), 0) : value.price}  ₹</span>

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
                    <span>{totalPrice} ₹</span>
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
                    <span>Stripe</span>
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
