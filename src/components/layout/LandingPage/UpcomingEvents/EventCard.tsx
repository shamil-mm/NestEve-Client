
import {Calendar,Users,Clock} from 'lucide-react'
import React from 'react';
import byemoon from '@/assets/byemoon.jpg'
type Event={
  title:string,
  description:string;
  category:string;
  image:string,
  startDate:string,
  capacity:number;
  eventTime:string;
  doortime:string;
}

type EventCardProps={
  event:Event
}
const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="relative min-h-120 flex flex-col items-center bg-transparent">
      {/* Event Image */}
      <img
        src={byemoon}
        alt={event.title}
        className="w-full h-60 object-cover rounded-lg"
      />
      
      {/* Event Info Box */}
      <div className="absolute top-50 w-3/4 p-4 bg-black/75 text-white border-2 border-white rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
        <p>{event.description}</p>
        <br />
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            {event.startDate}
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            {event.capacity}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            {event.eventTime}
          </div>
        </div>
      </div>
    </div>
  );
};


export default EventCard
