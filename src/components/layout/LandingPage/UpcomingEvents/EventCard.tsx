
import {Calendar,Users,Clock} from 'lucide-react'
import React from 'react';
import { IEvent } from '../../../../interfaces/IEvent';

type EventCardProps={
  event:IEvent
}
const EventCard: React.FC<EventCardProps> = ({ event }) => {

  return (
    <div className="relative min-h-120 flex flex-col items-center bg-transparent">
      {/* Event Image */}
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-60 object-cover rounded-lg"
      />
      
      {/* Event Info Box */}
      <div className="absolute top-50 w-3/4 p-4 bg-black/75 text-white border-2 border-white rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <div className='max-h-18 overflow-y-auto no-scrollbar'>
        <p>{event.description}</p>
        </div>
        <br />
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.startDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {event.capacity}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {event.startTime}
          </div>
        </div>
      </div>
    </div>
  );
};


export default EventCard
