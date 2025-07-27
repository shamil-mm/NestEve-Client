
import  { useEffect, useState } from 'react';
import {  Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../../../hooks/AuthHook';
import {  getFinanceData } from '../../../services/EventServices';



interface FinanceStats {
  eventId: string;
  eventname: string;
  ticketsSold: number;
  totalRevenue: number;
  refunds: number;
  netEarnings: number;
}

const OrganizerFinanceDatas = () => {
  const [eventData,setEventData]=useState<FinanceStats[]|[]>([])
  const [sortBy, setSortBy] = useState('Recent');
  const [filterBy, setFilterBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page,setPage]=useState(1)
  const [limit]=useState(8)
  const [totalPages,setTotalpages]=useState(1)

  const id = useAppSelector((state) => state.authUser?.user?.id) 
  const fetchData=async()=>{
    if(!id)return
    try {
      const res=await getFinanceData(id as string,page,limit,searchQuery,sortBy,filterBy)
      if(res?.data?.data){
      setEventData(res?.data?.data || [])
      setTotalpages(Math.ceil(res?.data?.total/limit))

    }
    } catch (error) {
      console.log('Failed to fetch finance data :' ,error)
    }
  }
  
  
  useEffect(()=>{
    fetchData()
  },[id,page,sortBy,filterBy,searchQuery])
  
  

  const formatCurrency = (amount:number) => {
    return amount.toLocaleString();
  };

  return (
    <div className="relative min-h-screen bg-black/70 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b ">
        <div className="flex items-center gap-4">
          <div className="relative">
            {/* <button className="flex items-center gap-2 bg-transparent px-4 py-2 rounded-sm border border-blue-600">
              <span>Sort by</span>
              <ChevronDown className="w-4 h-4" />
            </button> */}
            <select
              className="flex items-center gap-2 bg-black px-4 py-2 rounded-sm border border-blue-600"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setPage(1)
              }}
              >
                  <option value="recent">Recent</option>
                  <option value="revenue">Revenue</option>
                  <option value="earnings">Earnings</option>
                  <option value="tickets Sold">Tickets Sold</option>
            </select>

          </div>
          
          <div className="relative">
            <select
                className="bg-black text-white border border-blue-600 px-4 py-2 rounded-sm"
                value={filterBy}
                onChange={(e) => {
                  setFilterBy(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">All</option>
                <option value="High Revenue">High Revenue</option>
                <option value="Low Earnings">Low Earnings</option>
          </select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-transparent border-blue-600 border  px-4 py-2 rounded-sm transition-colors">
            <FileText className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="bg-transparent border border-blue-600 rounded-sm pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className=" backdrop-blur rounded-sm border border-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white">
                <th className="text-left p-4 font-medium text-gray-300">Event Name</th>
                <th className="text-right p-4 font-medium text-gray-300">Total Revenue</th>
                <th className="text-right p-4 font-medium text-gray-300">Tickets Sold</th>
                
                <th className="text-right p-4 font-medium text-gray-300">Refunds</th>
                <th className="text-right p-4 font-medium text-gray-300">Net Earnings</th>
                <th className="text-right p-4 font-medium text-gray-300">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {eventData.length ===0 ?(
                <td colSpan={7} className="text-center py-6 text-gray-400">
                No finance data found.
              </td>
              ):(
                <>
                {eventData && eventData.map((event, index) => (
                <tr key={index} className="border-b border-white transition-colors">
                  <td className="p-4 text-white font-medium">{event.eventname}</td>
                  <td className="p-4 text-right text-white">{formatCurrency(event.totalRevenue)}</td>
                  <td className="p-4 text-right text-white">{event.ticketsSold}</td>
                  <td className="p-4 text-right text-white">{formatCurrency(event.refunds)}</td>
                  <td className="p-4 text-right text-white">{formatCurrency(event.netEarnings)}</td>
                  <td className="p-4 text-right text-white">{formatCurrency(event.totalRevenue + event.refunds)}</td>
                </tr>
              ))}
                </>
              )}
              
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
     <div className="absolute bottom-0 left-0 right-0  flex justify-between items-center px-6 pb-6">
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

export default OrganizerFinanceDatas;