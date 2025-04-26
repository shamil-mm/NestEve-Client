import { useEffect, useState } from "react"
import { fetchEvents, removeEvent } from "../../../services/EventServices"
import OrganizerEventCard from "../../ui/OrganizerEvent/OrganizerEventCardUI"
import { IEvent } from "../../../interfaces/IEvent"
import EventDetailView from "../../ui/OrganizerEvent/EventDetailView"
import OrganizerCreateEvent from "./OrganizerCreateEvent"
import { useAppSelector } from "../../../hooks/AuthHook"


const OrganizerEvents= () => {


  const [events,setEvents]=useState<IEvent[]>([])
  const [detailview,setDetaiview]=useState(false)
  const [detailviewEvent,setDetaiviewEvent]=useState<IEvent|null>(null)
  const [isEdit,setIsEdit]=useState(false)
  const [editEvent,setEditEvent]=useState<IEvent|null>(null)
 const id = useAppSelector((state) => state.authUser?.user?.id) 
  
  useEffect(()=>{

    async function fetchEvent(){
        try {
          if(id){
            const response=await fetchEvents(id )
          if(response?.data?.events){
            setEvents(response?.data?.events)
          }

          }
        } catch (error) {
          console.log('fetch events errror',error)
        }
      }
      fetchEvent()
    },[isEdit])
    

    const detailView=async(value:boolean,event:IEvent,type:string)=>{
      if(type==="detailedView"){
        setDetaiview(value)
        setDetaiviewEvent(event)
      } else if(type==="EditEvent"){
        setIsEdit(value)
        setEditEvent(event)
      }
      else if(type==="DeleteEvent"){
        const eventId=event._id
        const response=await removeEvent(eventId)
        console.log('deleted response',response)
        if(response?.statusText==="OK"){

          const updatedevents= events.filter((event)=>event._id!==eventId)
          setEvents(updatedevents)
        }
      }
    }

    const close=(value:boolean)=>{
      setIsEdit(value)
      setEditEvent(null)
      setDetaiview(value)
      setDetaiviewEvent(null)
    }

    
    if(detailview&& detailviewEvent){
      return(
      <EventDetailView event={detailviewEvent} close={close}/>
      )
    }
    if(isEdit && editEvent){
      return(
       
      <OrganizerCreateEvent  close={close} editEvent={editEvent} />
      )
    }
  return (

    <>
    <h1 className="text-white">
      Organized  Events List
    </h1>
    {events.length>0 ? (
      events.map((event)=>(
        <div className="p-2" key={event._id}>
          <OrganizerEventCard  event={event} callback={detailView}/>
        </div>
      ))
    ):(<p className="text-white">No events found</p>)
    }
   
    </>
  )
}

export default OrganizerEvents
