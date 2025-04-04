import {   SquarePen } from "lucide-react"
import { useState } from "react"
import OrganizerCreateEvent from "./OrganizerCreateEvent"


const OrganizerHome = () => {
    const [createEvent,setCreateEvent]=useState<boolean>(false)
    const close=(value:boolean)=>{
        setCreateEvent(value)
    }

   if(createEvent){
    return(<OrganizerCreateEvent close={close}/>)
   }
  return (
    <div className="text-white">
      <div className="flex items-center">
      <div className="bg-black text-white border border-blue-600 p-5 w-full max-w-sm flex flex-col items-center">
        <SquarePen size={100}  className="text-blue-600 p-5 " />
        
        <h1 className="text-4xl font-bold mb-4 text-center">CREATE YOUR EVENT</h1>
        
        <p className="text-center mb-8">
          Provide event information, customize ticket options, and manage recurring schedules seamlessly.
        </p>
        
        <button onClick={()=>setCreateEvent(true)} className="bg-transparent border border-blue-600  text-white font-bold py-3 px-20 cursor-pointer">
          Create Event
        </button>
      </div>
    </div>
    </div>
  )
}

export default OrganizerHome
