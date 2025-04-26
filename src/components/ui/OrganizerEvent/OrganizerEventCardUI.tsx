import { Calendar, Clock, MapPin, Pencil, Trash2 } from 'lucide-react';
import { IEvent } from '../../../interfaces/IEvent';


interface OrganizerEventCardProps{
 event:IEvent
 callback(value:boolean,event:IEvent,type:string):void;
}



const OrganizerEventCard:React.FC<OrganizerEventCardProps> = ({event,callback}) => {


  const handleEdit=(e:React.MouseEvent<HTMLButtonElement>,event:IEvent)=>{
    e.preventDefault()
    callback(true,event,"EditEvent")
  }
  const handleDelete=(e:React.MouseEvent<HTMLButtonElement>,event:IEvent)=>{
    e.preventDefault()
    callback(true,event,'DeleteEvent')
  }
 
    
  return (
    <div className="flex flex-row w-full bg-black text-white  overflow-hidden border border-white">
  {/* Left Side - Image */}
  <div className="relative w-1/3 h-auto">
    {/* Image with overlay */}
    <div className="h-full w-full relative">
      <div className=" p-2  absolute inset-0 bg-black/60">
        <img
          src={event.image}
          alt="event image"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Controls */}
      

      {/* Event Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h1 className="text-2xl text-center font-bold">{event.title}</h1>
      </div>
    </div>
  </div>

  {/* Right Side - Content */}
  <div className="p-4 flex flex-col gap-3 w-2/3">
    {/* Event type badge and meta */}
    <div className="flex flex-wrap items-center gap-10">
      <span className="bg-blue-900 text-white text-xs px-3 py-1 rounded-full">{event.category.categoryName}</span>
      <div className="flex items-center gap-1">
        <Calendar size={16} />
        <span className="text-sm">{new Date(event.startDate).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <MapPin size={16} />
        <span className="text-sm">{event.locationName}</span>
      </div>
      <div className="flex items-center gap-1">
        <p>Price <span className="text-sm font-medium">₹{event.is_seated===false?event?.ticketTypes[0].price: Math.min(...event.layoutConfig.categories.map((value)=>value.price)).toString() }</span></p>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={16} />
        <span className="text-sm">{event.startTime} - {event.endTime}</span>
      </div>
      

      <div className="flex gap-2 ml-auto">
        <button onClick={(e)=>handleEdit(e,event)} className="p-1 bg-black/40 rounded-md hover:bg-black/60 transition">
        <Pencil size={18}/>
        </button>
        <button onClick={(e)=>handleDelete(e,event)} className="p-1 bg-black/40 rounded-md hover:bg-black/60 transition">
        <Trash2 color='red'  size={18}/>
        </button>
      </div>
    </div>

    {/* Description */}
    <p className="text-sm"> {event.description}</p>

    {/* Buttons */}
    <div className="flex justify-between mt-auto">
      <button className="border border-indigo-800 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md">
        Manage Tickets
      </button>
      <button onClick={()=>callback(true,event,"detailedView")} className="border border-indigo-800 text-white  hover:bg-indigo-700 text-sm px-4 py-2 rounded-md">
        Detailed View
      </button>
    </div>
  </div>
</div>

  );

};

export default OrganizerEventCard;