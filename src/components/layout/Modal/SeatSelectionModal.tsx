import { Armchair, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { IEvent } from "../../../interfaces/IEvent";
import { generateTheaterSeating } from "../../../utils/generateSeatRows";
import { ITicket } from "../../ui/Checkout/NonseatedCheckout";
import { fetchBookedSeats } from "../../../services/bookingService";
import { IfilteredRows } from "../../../interfaces/filteredRow";


interface SeatSelectionModalProps{
    event:IEvent,
    tickets:ITicket[],
    ticket:ITicket,
    selectFN:(selectedSeats:[],totalSeatPrice:string,category:string,seatcount:number)=>void
}

const SeatSelectionModal:React.FC<SeatSelectionModalProps> = ({event,tickets,selectFN,ticket}) => {  
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [filteredRows,setFilteredRows]=useState<IfilteredRows[]>([])

  useEffect(()=>{
    const cTicket=tickets.find(t=>t.name===ticket.name)
    if(cTicket &&cTicket.selectedSeats &&  cTicket.selectedSeats?.length as number> 0){
      setSelectedSeats(cTicket.selectedSeats)
      console.log(cTicket.selectedSeats)
    }
    

  },[tickets,ticket.name])
  useEffect(()=>{
    async function featchBookedTickets(){
      try {
        const res= await fetchBookedSeats(event._id as string)
        const seats=res?.data?.selectedSeats
        const response=generateTheaterSeating(event.layoutConfig ,ticket.name ,seats)
        const theaterSeating =response ||{ rows:[]}
        const filteredRows=theaterSeating.rows
        setFilteredRows(filteredRows)
      } catch (error) {
        console.log('error in seat selection modal page',error)
      }

    }
    featchBookedTickets()
  },[])

  

  
  


  

  const totalPrice = selectedSeats.reduce((total, seat) => {
    const category = event.layoutConfig.categories.find(cat => cat.name === seat.category);
    return total + (category?.price || 0);
  }, 0);
  
  const handleSeatClick = (seat: any) => {

    if (seat.status === "taken") return;

    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      
    } else {
        setSelectedSeats((prev) => {
         if(prev.length >= ticket.quantity){
          return prev
        }
       return [...selectedSeats, seat]
    })
  };
}





const confirmSelection=(e:React.MouseEvent<HTMLButtonElement>)=>{
  e.preventDefault()
  selectFN((selectedSeats as []),totalPrice,ticket.name,ticket.quantity)
  
}



  return (
    <div className="w-full   bg-black/70 border-1 border-white text-white p-4 h-100vh">
  
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold">{event.title}</h1>
        <p className="text-sm text-gray-300">{new Date(event.startDate).toLocaleDateString()} • {event.venue}</p>
      </div>
     

      <div className="mb-4">
      
        <div className="grid grid-cols-1 ">
        <button className={`p-2  flex items-center justify-center uppercase text-sm bg-black border-1 border-blue-700`}>
              <Armchair className={`h-4 w-4 mr-1 `} />
              {ticket.name}
            </button>
        </div>
      </div>
      
     
      <div className="w-full bg-black py-2 text-center mb-4 border-white border-1">
        <p className="text-gray-300 uppercase text-sm font-bold">STAGE</p>
      </div>
      
      
      <div className="border-white border-1 bg-black  p-3  mb-4 overflow-x-auto">
        <div className="flex flex-col items-center">
          {filteredRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center mb-2 w-full justify-center">
              <span className="w-6 text-center font-bold mr-2">{row.id}</span>
              <div className="flex gap-1">
                {row.seats.map((seat: any, seatIdx: number) => {
                  const category = event.layoutConfig.categories.find(cat => cat._id === seat.category);
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  return (
                    <button
                      key={seatIdx}
                      className={`w-6 h-6 flex items-center justify-center border-blue-700 border-1 bg-black  ${
                        seat.status === 'taken' ? ' cursor-not-allowed border-red-600 border-1 font-bold' : 
                        isSelected ? 'border-green-400 border-3 font-bold' :"" 
                        
                        
                      }`}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'taken'}
                    >
                      {isSelected ? <Check className="h-3 w-3 text-green-400 " /> : 
                       <span className="text-xs">{seatIdx + 1}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      
      <div className="flex justify-center gap-3 mb-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-black mr-1 border-1 border-blue-600 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 border-1 border-green-500 mr-1 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-black border-1 border-red-500 mr-1 rounded"></div>
          <span>Taken</span>
        </div>
      </div>
      
     
      {selectedSeats.length > 0 && (
        <div className="bg-black p-3 border-1 border-white mb-4">
          <h2 className="font-bold mb-2">Your Selection</h2>
          <div className="space-y-1">
            {selectedSeats.map((seat, idx) => {
              const category = event.layoutConfig.categories.find(cat => cat.name === seat.category);
              return (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Armchair className={`h-3 w-3 mr-1 `} />
                    <span>{category?.name} - {seat.id}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">${category?.price}</span>
                    <button 
                      className="text-red-400"
                      onClick={() => setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-700 flex justify-between">
            <span className="font-bold">Total:</span>
            <span className="font-bold">${totalPrice}</span>
          </div>
        </div>
      )}
      
      
      <button 
      onClick={confirmSelection}
        className={`w-full py-2  font-bold bg-black border-1 border-blue-700  ${
          selectedSeats.length > 0 ? '' : 'cursor-not-allowed'
        }`}
        disabled={selectedSeats.length === 0}
      >
        {selectedSeats.length > 0 ? `Confirm Selection ($${totalPrice})` : 'Select seats to continue'}
      </button>
    </div>
  );
};

export default SeatSelectionModal;