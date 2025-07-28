
import { ChevronDown } from 'lucide-react';
import React from 'react';
interface EventFilterProps {
    label?: string;
    placeholder: string;
  }

const EventFilter:React.FC<EventFilterProps> = ({  placeholder }) => {
  return (
    <div className="relative">
      <select defaultValue="option" className="w-full py-3 px-4 pr-8 bg-indigo-900/40 border border-indigo-800 rounded-md text-white appearance-none focus:outline-none focus:ring-2 focus:ring-white">
        <option value="option" disabled >{placeholder}</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  )
}

export default EventFilter
