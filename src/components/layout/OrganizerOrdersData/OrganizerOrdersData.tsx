import  { useEffect, useState } from 'react';
import { ChevronDown, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useAppSelector } from '../../../hooks/AuthHook';
import { fetchEvents } from '../../../services/EventServices';
import { getBookingsByEventIds } from '../../../services/bookingService';
import { transformBookingData } from '../../../utils/transformBookingData';

interface TransformedBooking {
  attendeeName: string;
  date: string;
  eventName: string;
  orderId: string;
  status: string;
  totalAmount: number;
}

const OrganizerOrdersData = () => {
    const userId = useAppSelector((state) => state.authUser?.user?.id)
    const [ordersData, setOrdersData] = useState<TransformedBooking[]>([]);

      
  const [sortBy, setSortBy] = useState('Recent');
  const [filterBy, setFilterBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<TransformedBooking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(8)
   
     useEffect(() => {
    const fetchOrganizerBookings = async () => {
      try {
        if (!userId) return;

        const resp = await fetchEvents(userId);
        const events = resp?.data?.events ?? [];

        const eventIdArray = events.map((event: { _id: string }) => event._id);

        if (eventIdArray.length > 0) {
          const bookingsResp = await getBookingsByEventIds(eventIdArray,{
            search:searchQuery,
            sortBy,
            filterBy,
            page,
            limit
          });
          console.log('booking resp',bookingsResp)
          if(bookingsResp){
            const trasformedData=await transformBookingData(bookingsResp?.data?.data?.bookings)
            console.log("Bookings:", trasformedData);
            if(trasformedData){
              setOrdersData(trasformedData)
              const totalCount=bookingsResp?.data?.data?.totalCount || 0
              const computedTotalPages=Math.ceil(totalCount/limit)
              setTotalPages(computedTotalPages);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching organizer bookings:", error);
      }
    };

    fetchOrganizerBookings();
  }, [userId,searchQuery,sortBy,filterBy,page]);

   
  


  useEffect(() => {
  let updated = [...ordersData];


  if (searchQuery.trim() !== '') {
    updated = updated.filter(order =>
      order.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterBy) {
  
    updated = updated.filter(order => order.status === filterBy);
  }

  if (sortBy === 'Amount') {
    updated.sort((a, b) => b.totalAmount - a.totalAmount);
  } else if (sortBy === 'Date') {
    updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  setFilteredOrders(updated);
}, [ordersData, searchQuery, sortBy, filterBy]);

  
  

  const getStatusBadge = (status:string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 min-w-fit";
    
    switch (status) {
      case 'Confirmed':
        return (
          <div className={`${baseClasses} bg-green-800 text-white`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            {status}
            <ChevronDown className="w-3 h-3" />
          </div>
        );
      case 'Pending':
        return (
          <div className={`${baseClasses} bg-yellow-600 text-white`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            {status}
            <ChevronDown className="w-3 h-3" />
          </div>
        );
      case 'Canceled':
        return (
          <div className={`${baseClasses} bg-red-800 text-white`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            {status}
            <ChevronDown className="w-3 h-3" />
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} bg-gray-600 text-white`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            {status}
            <ChevronDown className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black/70 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* <button className="flex items-center gap-2  px-4 py-2 rounded-sm border border-blue-600 hover:bg-blue-700 transition-colors">
              <span>Sort by</span>
              <ChevronDown className="w-4 h-4" />
            </button> */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-sm border border-blue-600 bg-black text-white"
            >
              <option value="Recent">Recent</option>
              <option value="Date">Date</option>
              <option value="Amount">Amount</option>
            </select>

          </div>
          
          <div className="relative">
            {/* <button className="flex items-center gap-2  px-4 py-2 rounded-sm border border-blue-600 hover:bg-blue-700 transition-colors">
              <span>Filter by</span>
              <ChevronDown className="w-4 h-4" />
            </button> */}
                <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="px-4 py-2 rounded-sm border border-blue-600 bg-black text-white"
                  >
                    <option value="">All Status</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="canceled">Canceled</option>
                </select>

          </div>
          
          {/* <span className="text-gray-300 text-sm">Recent</span> */}
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

      {/* Table */}
      <div className="p-6">
        <div className=" backdrop-blur rounded-xl border border-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white">
                <th className="text-left p-4 font-medium text-gray-300">Order ID</th>
                <th className="text-left p-4 font-medium text-gray-300">Event Name</th>
                <th className="text-left p-4 font-medium text-gray-300">Attendee Name</th>
                <th className="text-left p-4 font-medium text-gray-300">Status</th>
                <th className="text-left p-4 font-medium text-gray-300">Date</th>
                <th className="text-right p-4 font-medium text-gray-300">Total Amount</th>
                <th className="text-center p-4 font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400">
                No orders found.
              </td>
            </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={index} className="border-b border-white">
                    <td className="p-4 text-white font-medium">{order.orderId}</td>
                    <td className="p-4 text-white">{order.eventName}</td>
                    <td className="p-4 text-white">{order.attendeeName}</td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-white">{order.date}</td>
                    <td className="p-4 text-right text-white">{order.totalAmount}</td>
                    <td className="p-4 text-center">
                      <button className="border border-blue-700 px-3 py-1 rounded text-white text-sm transition-colors flex items-center gap-1 mx-auto">
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 pb-6">
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
  );
};

export default OrganizerOrdersData;