import {   SquarePen } from "lucide-react"
import { useState } from "react"
import OrganizerCreateEvent from "./OrganizerCreateEvent"
interface OrganizerHomeProps{
  onSuccess(value:string):void
}

const OrganizerHome:React.FC<OrganizerHomeProps> = ({onSuccess}) => {
    const [createEvent,setCreateEvent]=useState<boolean>(false)
    const close=(value:boolean)=>{
        setCreateEvent(value)
    }

   if(createEvent){
    return(<OrganizerCreateEvent close={close} onSuccess={onSuccess}/>)
   }
  return (
    <div className="text-white w-full">
      <div className="flex items-center justify-center">
      <div className="bg-black text-white border border-blue-600 p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col items-center">
        <SquarePen size={60} className="sm:w-80 sm:h-80 md:w-100 md:h-100 text-blue-600 p-3 sm:p-5" />
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center">CREATE YOUR EVENT</h1>
        
        <p className="text-sm sm:text-base text-center mb-6 sm:mb-8 px-2">
          Provide event information, customize ticket options, and manage recurring schedules seamlessly.
        </p>
        
        <button onClick={()=>setCreateEvent(true)} className="bg-transparent border border-blue-600 text-white font-bold py-2 sm:py-3 px-8 sm:px-16 md:px-20 cursor-pointer text-sm sm:text-base">
          Create Event
        </button>
      </div>
    </div>
    </div>
  )
}

export default OrganizerHome
