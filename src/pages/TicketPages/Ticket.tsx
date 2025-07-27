import { useCallback, useEffect, useState } from "react"

import PageLayout from "../../components/layout/OrganizerPageLayout/PageLayout"
import BrowseEventSidebar from "../../components/common/SideBar/BrowseEventSidebar"
import { useAppSelector } from "../../hooks/AuthHook"
import SearchBar from "../../components/ui/SearchBar/SearchBar"
import TicketsList from "../../components/layout/Tickets/TicketsList"
import { getUserBookings } from "../../services/bookingService"
import { IBooking } from "../../interfaces/Booking/IBooking"
import EventTicket from "../../components/ui/UserProfile/EventTicket"




const Ticket = () => {

     const id = useAppSelector((state) => state.authUser?.user?.id) 
      const [booking,setBooking]=useState<Partial<IBooking>[]|null>(null)
      const [ticketModal,setTicketModal]=useState<boolean>(false)
    const [singleBooking,setSingleBooking]=useState<IBooking|null>(null)
    
      
     useEffect(()=>{
        async function bookingfc(){
        try {
           if (!id) return;
         const res= await getUserBookings(id as string) 
         setBooking(res?.data?.data)
        } catch (error) {
          console.log(error);  
        }
  
      }
      bookingfc()
      },[id])

   
      const handleTicketModal=(value:boolean,booking:IBooking)=>{
      setTicketModal(value)
      setSingleBooking(booking)
    }
      
    

    const [filters,setFilters]=useState({
      search:"",
      category:"",
      date:{
        dateFilter:"",
        customDate:""
      }
    })
   
   
   
    

    const handleSearch=useCallback((query:string)=>{
        if(query && query.toString().trim()===""){
          setFilters(prev=>({...prev ,search:""}))
         
        }else{
          setFilters(prev=>({...prev ,search:query}))
        }
    },[filters])

    const getSelectedFilters=(dateFilter:string,category:string,customDate?:string|null)=>{

      setFilters(prev=>({
        ...prev,
        category,
        date:{
          ...prev.date,
          dateFilter,
          customDate:customDate as string ?? ""
        }
      }))
    }






    if(ticketModal && singleBooking){
      return(
        <EventTicket booking={singleBooking}/>
      )
    }
    

 
  return (

    <>
   
  <PageLayout>
    <BrowseEventSidebar getSelectedFilters={getSelectedFilters}/>
    
        <div className="w-8/12 h-fit flex flex-col px-3 ">
        

        <div className="text-white flex justify-between items-center">
 
  <div>
   
  </div>

 
  <div className="flex items-center gap-2">
    <select name="sort" className="border-white rounded-sm h-10 border-2 my-2 bg-black text-white">
      <option value="">Sort</option>
      <option value="price-low-to-high">Low to High</option>
      <option value="price-high-to-low">High to Low</option>
    </select>

    <SearchBar onSearch={handleSearch} />
  </div>
</div>

          <div>
        <TicketsList booking={booking as IBooking[]} handleTicketModal={handleTicketModal} />
        </div>

        </div>
       
    </PageLayout>
    </>

  )
}

export default Ticket
