
import PageLayout from "../../components/layout/OrganizerPageLayout/PageLayout"
import BrowseEventSidebar from "../../components/common/SideBar/BrowseEventSidebar"
import SearchBar from "../../components/ui/SearchBar/SearchBar"
import { useCallback, useEffect, useState } from "react"
import { IEvent } from "../../interfaces/IEvent"
import { fetchSearchEvents } from "../../services/EventServices"
import { useAppSelector } from "../../hooks/AuthHook"
import UserEventCardUI from "../../components/ui/UserEventCardUI/UserEventCardUI"
import UserEventDetail from "../../components/ui/UserEventCardUI/UserEventDetail"
import CheckoutModal from "../../components/layout/Modal/CheckoutModal"




const BrowseEvent = () => {

    const [events,setEvents]=useState<IEvent[]>([])
    const [checkoutModal,setCheckoutModal]=useState<boolean>(false)
    const [totalPages, setTotalPages] = useState(1);

 

    const [filters,setFilters]=useState({
      search:"",
      sort:"",
      category:"",
      page:'1',
      limit:'3',
      date:{
        dateFilter:"",
        customDate:""
      }
    })
    
    const checkoutmodalfn=useCallback((value:boolean)=>{
      
      setCheckoutModal(value)

    },[checkoutModal])

    const id = useAppSelector((state) => state.authUser?.user?.id) 
    const [detailview,setDetailview]=useState(false)
  const [detailviewEvent,setDetailviewEvent]=useState<IEvent|null>(null)
    useEffect(()=>{

        async function fetchEvent(){
            try {
              if(id){
                let response;
                  response=await fetchSearchEvents(filters )  
              if(response?.data?.events?.events){
                setEvents(response?.data?.events?.events)
                setTotalPages(response?.data?.events?.totalPages)
              }
    
              }
            } catch (error) {
              console.log('fetch events errror',error)
            }
          }
          fetchEvent()
        },[filters])

           useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [filters.page]);
    
    
        
    const handleSearch=useCallback((query:string)=>{
        if(query && query.toString().trim()===""){
          setFilters(prev=>({...prev ,search:""}))
         
        }else{
          setFilters(prev=>({...prev ,search:query,page:'1'}))
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


    const detailView=async(value:boolean,event:IEvent,type:string)=>{
         if(type==="detailedView"){
           setDetailview(value)
           setDetailviewEvent(event)
         }
       }
       const close=(value:boolean)=>{
        setDetailview(value)
        setDetailviewEvent(null)
      }

    if(checkoutModal){
      return(
        <>
          <CheckoutModal />
        </>
      )
    }   
  return (

    <>
  <PageLayout>
 
    

    <BrowseEventSidebar getSelectedFilters={getSelectedFilters}/>
    

    {detailview && detailviewEvent?(
        <div className="w-9/12 h-fit flex flex-col px-3">
            <UserEventDetail event={detailviewEvent} close={close} checkoutmodalfn={checkoutmodalfn}/>
        </div>
    ):(
        <div className="w-9/12 h-fit flex flex-col px-3 ">
        <div className=" text-white flex justify-end">
          <select name="sort" value={filters.sort} onChange={(e)=>
            setFilters((prev)=>({
              ...prev,
              sort:e.target.value,
              page:'1'
            })
          )} className=" border-white rounded-sm h-10">
            <option value="" className="bg-black text-white">Sort</option>
            <option value="latest" className="bg-black text-white">Latest</option>
            <option value="price-low-to-high" className="bg-black text-white">Price Low to High</option>
            <option value="price-high-to-low" className="bg-black text-white">Price High to Low</option>
          </select>
     
         &nbsp; &nbsp;
         <SearchBar onSearch={handleSearch}/>
       
        </div>
        <div>
       {events.length > 0 ? (
  <>
    {events.map((event) => (
      <div className="py-2" key={event._id}>
        <UserEventCardUI event={event} callback={detailView} />
      </div>
    ))}

    {/* 👇 Add pagination here */}
    <div className="flex justify-center gap-2 mt-4">
      <button
        disabled={Number(filters.page) === 1}
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            page: String(Number(prev.page) - 1),
          }))
        }
        className="bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              page: String(i + 1),
            }))
          }
          className={`px-3 py-1 rounded ${
            Number(filters.page) === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-black"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={Number(filters.page) === totalPages}
        onClick={() =>
          setFilters((prev) => ({
            ...prev,
            page: String(Number(prev.page) + 1),
          }))
        }
        className="bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </>
) : (
  <p className="text-white">No events found</p>
)}



       
        </div>
        </div>
  
       
    )}
   
    

    
  </PageLayout>
   
    </>

  )
}

export default BrowseEvent
