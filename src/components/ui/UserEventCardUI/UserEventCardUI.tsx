import { Calendar, Clock, MapPin, } from 'lucide-react';
import { IEvent } from '../../../interfaces/IEvent';
import { getGeoAddress } from '../../../utils/geocode';
import { useEffect, useState } from 'react';


interface UserEventCardUIProps{
    event:IEvent
    callback(value:boolean,event:IEvent,type:string):void;
   }
   
   
const UserEventCardUI:React.FC<UserEventCardUIProps> = ({event,callback}) => {
  
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      if (event.location.coordinates) {
        const result = await getGeoAddress(event.location.coordinates[1], event.location.coordinates[0]);
        setAddress(result);
      }
    };
    fetchAddress();
  }, [event]);


  let priceRange
  if(event.layoutConfig){
     priceRange=event.layoutConfig.categories.map((value)=>({category:value.name,price:Number(value.price)}))
  }else{
     priceRange=event.ticketTypes.map((value)=>({category:value.name,price:Number(value?.price)})) 
  }


  
  return (
    <div className="flex flex-row w-full h-50 bg-black text-white  overflow-hidden border border-white">
    
    <div className="relative w-1/3 h-auto">
    
      <div className="h-full w-full relative">
        <div className=" p-2  absolute inset-0 bg-black/60">
          <img
            src={event.image}
            alt="event image"
            className="w-full h-full object-cover opacity-70"
          />
        </div>
  
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h1 className="text-2xl text-center font-bold">{event.title}</h1>
        </div>
      </div>
    </div>
  
    
    <div className="p-4 flex flex-col gap-3 w-2/3">
    
      <div className="flex flex-wrap items-center gap-10">
        <span className="bg-blue-900 text-white text-xs px-3 py-1 rounded-full">{event.category.categoryName}</span>
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span className="text-sm">{new Date(event.startDate).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <p>Price <span className="text-sm font-medium">{priceRange.map((value,index)=><span key={index}> [{value.category}-{value.price}]</span>)}</span></p>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span className="text-sm">{event.startTime} - {event.endTime}</span>
        </div>
      </div>
  
    <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span className="text-sm">{address}</span>
        </div>
      <p className="text-sm"> {event.description}</p>
  

      <div className="flex justify-end mt-auto">
    
        <button onClick={()=>callback(true,event,"detailedView")} className="border border-indigo-800 text-white  hover:bg-indigo-700 text-sm px-4 py-2 rounded-md">
          Detailed View
        </button>
      </div>
    </div>
  </div>
  )
}

export default UserEventCardUI
