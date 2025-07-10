

import { IBooking } from "../../../interfaces/Booking/IBooking";
import EventCart from "../../ui/UserProfile/EventCart";

interface TicketsListProps {
  booking: IBooking[] | null;
  handleTicketModal: (value: boolean, booking: IBooking) => void;
}
const TicketsList:React.FC<TicketsListProps> = ({booking,handleTicketModal}) => {

 
  
  
     

       
  return (
    <div>
        <div className="w-full mx-auto bg-black/800 text-white  overflow-hidden shadow-xl ">
         <h1 className="text-white">
             {booking && booking.map((item,index) => (
        <EventCart key={index} booking={item} ticketModal={handleTicketModal}/>
         ))}
                
         </h1>

    </div>
    </div>
  )
}

export default TicketsList
