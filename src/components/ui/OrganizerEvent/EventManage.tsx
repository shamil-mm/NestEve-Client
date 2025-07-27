import {  ChevronLeft, ChevronRight, Search } from "lucide-react";
import { IEvent } from "../../../interfaces/IEvent";
import { useEffect, useState } from "react";
import { getBookingsByEventIds } from "../../../services/bookingService";


interface EventManageProps{
    event:IEvent
    close: (value:boolean) => void;
}
interface Booking {
  id: string;
  attendeeName: string;
  ticketCount: number;
  bookingDate: string;
  paymentStatus: 'paid' |'refund';
  verified: boolean;
}


const EventManage:React.FC<EventManageProps> = ({event,close}) => {
   
    // const userId = useAppSelector((state) => state.authUser?.user?.id)
       const [eventOrdersData, setEventOrdersData] = useState<Booking[]>([]);
   
         
    //  const [sortBy, setSortBy] = useState('Recent');
     const [filterBy] = useState('');
     const [searchQuery, setSearchQuery] = useState('');
    //  const [filteredOrders, setFilteredOrders] = useState<Booking[]>([]);
     const [page, setPage] = useState(1);
     const [totalPages, setTotalPages] = useState(1);
     const [limit] = useState(8)

   useEffect(() => {
      const fetchOrganizerBookings = async () => {
        try {
            const bookingsResp = await getBookingsByEventIds([event._id],{
              search:searchQuery,
              filterBy,
              page,
              limit
            });
      

            const transformedData: Booking[] = bookingsResp?.data?.data?.bookings.map((booking: any) => ({
  id: booking._id,
  attendeeName: booking.user?.name || "Unknown",
  ticketCount: booking.tickets?.length || 0,
  bookingDate: new Date(booking.createdAt).toLocaleDateString(),
  paymentStatus: booking.paymentStatus || "unpaid",
  verified: booking.verified,
}));


        
              if(transformedData){
                setEventOrdersData(transformedData)
                const totalCount=bookingsResp?.data?.data?.totalCount || 0
                const computedTotalPages=Math.ceil(totalCount/limit)
                setTotalPages(computedTotalPages);
              }
            
          
        } catch (error) {
          console.error("Error fetching organizer bookings:", error);
        }
      };
  
      fetchOrganizerBookings();
    }, [event,searchQuery,filterBy,page]);



     useEffect(() => {
  let updated = [...eventOrdersData];


  if (searchQuery.trim() !== '') {
    updated = updated.filter(order =>
      order.bookingDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.attendeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterBy) {
  
    updated = updated.filter(order => order.paymentStatus === filterBy);
  }



  // setFilteredOrders(updated);
}, [eventOrdersData, searchQuery, filterBy]);


  return (
   <div className=" relative max-w-full min-h-screen mx-auto bg-black/60 text-white  overflow-hidden shadow-xl ">
    <div className='flex justify-end'>
          <button onClick={()=>close(false)} className="p-2 ">
        &larr; back
        </button>  
    </div>


     <div className="flex justify-between items-center p-6 border-b border-white">
        <div className="flex items-center gap-4">
          <span className="text-gray-300 text-xl capitalize">{event.title}</span>

        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, order ID, or event"
            className="border border-blue-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />

        </div>
      </div>

     <div className="p-6">
      <div className="backdrop-blur rounded-xl border border-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white">
              <th className="text-left p-4 font-medium text-gray-300">Ticket ID</th>
              <th className="text-left p-4 font-medium text-gray-300">Attendee Name</th>
              <th className="text-left p-4 font-medium text-gray-300">Tickets</th>
              <th className="text-left p-4 font-medium text-gray-300">Booking date</th>
              <th className="text-left p-4 font-medium text-gray-300">payment status</th>
              <th className="text-left p-4 font-medium text-gray-300">Ticket status</th>
              {/* <th className="text-center p-4 font-medium text-gray-300">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {eventOrdersData.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No bookings found.
                </td>
              </tr>
            ) : (
              eventOrdersData.map((booking, index) => (
                <tr key={index} className="border-b border-white">
                  <td className="p-4 text-white font-medium">{booking.id.slice(-4)}</td>
                  <td className="p-4 text-white">{booking.attendeeName}</td>
                  <td className="p-4 text-white">{booking.ticketCount}</td>
                  <td className="p-4 text-white">{booking.bookingDate}</td>
                  <td className="p-4 text-white">{booking.paymentStatus}</td>
                  <td className="p-4  text-white">{booking.verified?"Verified":"Not Verified"}</td>
                  {/* <td className="p-4 text-center">
                    <button className="border border-blue-700 px-3 py-1 rounded text-white text-sm transition-colors flex items-center gap-1 mx-auto">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-6 pb-6">
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              className="w-10 h-10 rounded-full border border-blue-600 flex items-center justify-center"
              disabled={page === 1}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
    
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    page === i + 1 ? 'bg-blue-600 text-white' : 'bg-blue-800 hover:bg-blue-700 text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
    
            <button
              onClick={() => page < totalPages && setPage(page + 1)}
              className="w-10 h-10 rounded-full border border-blue-600 flex items-center justify-center"
              disabled={page === totalPages}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

   </div>
  )
}

export default EventManage
