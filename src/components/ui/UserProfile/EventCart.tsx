import { Star } from "lucide-react"
import nightlife from '../../../assets/byemoon.jpg'

const EventCart = () => {
  return (
    <div>
         <div className="rounded-lg overflow-hidden bg-black/50 border border-white/10">
      <div className="relative h-40">
        <img 
          src={nightlife}
          alt="Event" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
          NIGHT LIFE
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-xs px-2 py-1 rounded">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          DEC 31, 2024
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg">ByeMoon Party</h3>
          <div className="flex items-center gap-1 text-xs">
            <Star size={12} fill="yellow" stroke="yellow" />
            <span>4.8</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-300 line-clamp-2 my-1">
          Come ready to let go the night and welcome the New Year with us. Let's welcome the New Year with music, drinks, and good memories on December 31, 2024.
        </p>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <div>
            <div>Ticket holder</div>
            <div>Open date</div>
          </div>
          <div className="text-right">
            <div>DCNR4AJ</div>
            <div>8:30 PM</div>
          </div>
        </div>
        
        <div className="flex justify-between mt-3">
          <button className="bg-green-600/30 text-green-500 text-xs py-1 px-3 rounded-full">completed</button>
          <button className="bg-yellow-600/30 text-yellow-500 text-xs py-1 px-3 rounded-full">VIP</button>
        </div>
        
        <div className="flex justify-between mt-3">
          <button className="border border-white/30 text-xs py-1 px-3 rounded-full">TICKET VIEW</button>
          <button className="bg-red-600/30 text-red-500 text-xs py-1 px-3 rounded-full">cancel</button>
        </div>
      </div>
    </div>
      
    </div>
  )
}

export default EventCart
