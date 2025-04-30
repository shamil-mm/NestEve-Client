import { Minus, Plus, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { IEvent } from "../../../interfaces/IEvent";
import { toast } from "react-fox-toast";
import { useDispatch } from "react-redux";
import { setCheckoutData } from "../../../store/slices/checkout";






export interface ITicket {
  id:number;
  name:string;
  price:number;
  quantity:number;
  selectedSeats?:{id: string , status: string, category: string, price: number}[]
}

interface NonseatedCheckoutProps{
    event:IEvent
    modalfn(value:boolean,tickets:ITicket[],ticket:ITicket):void
    newTickets:ITicket[]
    updatedData:{selectedSeats:[],totalSeatPrice:string,cate:string,seatcount:number}
    checkoutModal(value:boolean):void
}


const NonseatedCheckout:React.FC<NonseatedCheckoutProps> = ({event,modalfn,updatedData,newTickets,checkoutModal}) => {

 const dispatch=useDispatch()
  const [tickets, setTickets] = useState<ITicket[]>(()=>{
        if(!event.is_seated){
          return event.ticketTypes.map((ticket,index)=>({
            id:index,
            name:ticket.name,
            price:Number(ticket.price),
            quantity:0
          }))
         }
        return event.ticketTypes.map((ticket,index)=>{
          const category=event.layoutConfig.categories.find(c=>c.name===ticket.name)
          return {
            id:index,
            name:ticket.name,
            price:category ?Number(category.price):0,
            quantity:0,
            selectedSeats:[],
          }
        })
});



 

    useEffect(()=>{
      if (event.is_seated && updatedData.cate){
        setTickets(newTickets)
        setTickets(prevTickets=>
          prevTickets.map(ticket=>{
            if(ticket.name===updatedData.cate){
              return {
                ...ticket,
                quantity:updatedData.seatcount,
                selectedSeats:updatedData.selectedSeats
              }
            } 
            return ticket
          })
        )
      }
    },[updatedData, event.is_seated])

   
   

    
    
      const updateTicketQuantity = (name:string, change:number) => {
        setTickets(prev =>
          prev.map(ticket =>
            ticket.name === name
              ? { ...ticket, quantity: Math.max(0, ticket.quantity + change) }
              : ticket
          )
        );
      };
    
      const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
      const totalPrice = tickets.reduce((sum, ticket) => {
        // const ticketType = event.ticketTypes.find(t => t.name === ticket.name);
        return sum + (ticket.quantity * ticket.price);
      }, 0);

      const handleSelectSeat=(e:React.MouseEvent<HTMLButtonElement>,ticket:ITicket)=>{
        e.preventDefault()
        modalfn(true,tickets,ticket)
      }





      const handleCheckout=(e:React.MouseEvent<HTMLButtonElement>,is_seated:boolean)=>{
        e.preventDefault()
        
        if(is_seated){
          const totalquantity=tickets.map((value)=>value.quantity).reduce((acc,value)=>acc+value)
          const totalseatSelected=tickets.map((value)=>value.selectedSeats).reduce((acc,value)=>acc+value!.length ,0)
         
         if(totalquantity===totalseatSelected){
         
          dispatch(setCheckoutData({tickets,isSeated:event.is_seated,event:{_id:event._id,title:event.title,startDate:event.startDate,startTime:event.startTime,endTime:event.endTime ,venue:event.venue,locationName:event.locationName}}))
          checkoutModal(true)
         }else{
          toast.error("Please select all the seats you've added before continuing")
         }
        }else{
          dispatch(setCheckoutData({tickets,isSeated:event.is_seated,event:{_id:event._id,title:event.title,startDate:event.startDate,startTime:event.startTime,endTime:event.endTime ,venue:event.venue,locationName:event.locationName}}))
          checkoutModal(true)
        }
      }

    

     
  return (
    
        <div className="max-w-md  bg-black border-2 border-blue-700 text-white p-6 ">
          <h1 className="text-2xl font-bold mb-6 text-center">{event.title}</h1>
          
          {/* Ticket selection section */}
          <div className="space-y-4 mb-8">
            {event.ticketTypes.map((type) => {
       
              const ticket:ITicket|undefined = tickets.find(t => t.name=== type.name);
              return (
                <div key={type.name} className="bg-black p-4 border-2 border-white">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{type.name}</h3>
                      <p className="text-white">${ticket!.price} per ticket</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                         ticket&& ticket.quantity > 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 cursor-not-allowed'
                        }`}
                        onClick={() => updateTicketQuantity(type.name, -1)}
                        disabled={ticket!.quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-bold">{ticket &&ticket.quantity}</span>
                      
                      <button
                        className={`w-8 h-8  rounded-full flex items-center justify-center ${
                          ticket  ? 'bg-gray-700 hover:bg-gray-700' : 'bg-gray-700 cursor-not-allowed'
                        }`}
                        onClick={() => updateTicketQuantity(type.name, 1)}
                      
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {ticket&&ticket.quantity > 0 && (
                    <div className="text-right text-sm">
                      Subtotal: ₹{ticket.quantity * (ticket.price as number)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {totalTickets > 0 && (
            <div className="bg-black p-4 mb-6">
              <h2 className="text-lg font-bold mb-3">Order Summary</h2>
              <div className="space-y-2">
                {tickets.filter(t => t.quantity > 0).map((ticket) => {
                  const type = event.ticketTypes.find(t => t.name === ticket.name);
                  return (
                    <div key={ticket.id}>
                    <div  className="flex justify-between">
                      <div className="flex items-center">
                        <Ticket className="h-4 w-4 mr-2" />
                        <span>{type!.name} × {ticket.quantity}</span>
                       
                      </div>
                      <span>₹{ticket.quantity * ticket!.price}</span>
                    </div>
                    <div>
                         {event.is_seated &&(
                            <button onClick={(e)=>handleSelectSeat(e,ticket)} className="bg-transparent border-2 rounded-sm cursor-pointer border-blue-600 px-2">select seat</button>
                        )}
                        {event.is_seated && ticket.selectedSeats && ticket.selectedSeats.length >0 && (
                          <div className="text-sm text-white mt-1">
                            Seats: {ticket.selectedSeats?.map((value,index)=>{
                             return <span key={index}>{value.id } &nbsp;</span>
                            })}
                          </div>
                        )}
                    </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between">
                <span className="font-bold">Total:</span>
                <span className="font-bold">₹ {totalPrice}</span>
              </div>
            </div>
          )}
          
          <button 
            className={`w-full py-3 rounded-sm border-2 cursor-pointer border-blue-700 font-bold ${
              totalTickets > 0 ? 'bg-black border-2 border-blue-700' : 'bg-black cursor-not-allowed'
            }`}
            disabled={totalTickets === 0}
            onClick={(e)=>handleCheckout(e,event.is_seated)}
          >
            {totalTickets > 0 ? `Checkout ₹  ${totalPrice}` : 'Add tickets to continue'}
          </button>
        </div>
      );

     
  
}

export default NonseatedCheckout
