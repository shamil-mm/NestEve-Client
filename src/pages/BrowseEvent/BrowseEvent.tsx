
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
    
    

    const [filters,setFilters]=useState({
      search:"",
      category:"",
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
              if(response?.data?.events){
                setEvents(response?.data?.events)
              }
    
              }
            } catch (error) {
              console.log('fetch events errror',error)
            }
          }
          fetchEvent()
        },[filters])
        
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
        <select name="sort" className=" border-white rounded-sm h-10">
            <option value="" className="bg-black text-white">Sort</option>
            <option value="price-low-to-high" className="bg-black text-white">Low to High</option>
            <option value="price-high-to-low" className="bg-black text-white">High to Low</option>
          </select>
     
         &nbsp; &nbsp;
         <SearchBar onSearch={handleSearch}/>
       
        </div>
        <div>
        {events.length>0 ? (
         events.map((event)=>(
           <div className="py-2" key={event._id}>
             <UserEventCardUI  event={event} callback={detailView}/>
           </div>
         ))
       ):(<p className="text-white">No events found</p>)
       }
        </div>
        </div>
  
       
    )}
   
    

    
  </PageLayout>
   
    </>

  )
}

export default BrowseEvent
