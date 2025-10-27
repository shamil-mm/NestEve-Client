
import {Calendar,Users,Clock} from 'lucide-react'
import React from 'react';
import { IEvent } from '../../../../interfaces/IEvent';

type EventCardProps={
  event:IEvent
}
const EventCard: React.FC<EventCardProps> = ({ event }) => {

  return (
    <div className="relative min-h-[240px] sm:min-h-[280px] md:min-h-[300px] lg:min-h-[320px] flex flex-col items-center bg-transparent">
      {/* Event Image */}
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 sm:h-56 md:h-60 object-cover rounded-lg"
      />
      
      {/* Event Info Box */}
      <div className="absolute top-40 sm:top-44 md:top-48 lg:top-50 w-[85%] sm:w-4/5 p-3 sm:p-4 bg-black/75 text-white border-2 border-white rounded-lg shadow-lg text-center">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{event.title}</h3>
        <div className='max-h-16 sm:max-h-18 overflow-y-auto no-scrollbar'>
        <p className="text-xs sm:text-sm md:text-base">{event.description}</p>
        </div>
        <br />
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:space-x-4 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(event.startDate).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {event.status}
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
