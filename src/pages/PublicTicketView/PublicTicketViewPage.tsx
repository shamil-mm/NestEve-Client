
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react";
import { IEvent } from "../../interfaces/IEvent";
import { fetchSingleEvent } from "../../services/EventServices";
import domtoimage from "dom-to-image";
import jsPDF from "jspdf";
import { Calendar, Clock, MapPin, QrCode, Star, Ticket } from "lucide-react";
import { IBooking } from "../../interfaces/Booking/IBooking";
import { fetchBooking } from "../../services/bookingService";


const PublicTicketViewPage = () => {

  const {token}=useParams()
  console.log(token,'token for ticket share' )
  const [booking,setBooking]=useState<Partial<IBooking>|null>(null)
  const [event, setEvent] = useState<IEvent | null>(null);
  const [hideImage, setHideImage] = useState(false);
  const [hiddenDownloadMode, setHiddenDownloadMode] = useState(false);

  const ticketRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    async function getBookging(){
        const response = await fetchBooking(token as string);
        if(response?.data?.data){
            setBooking(response?.data?.data)
        }
    }
   if(token) getBookging()
  },[token])

  useEffect(() => {
    async function getEvent() {
      const eventId = booking?.eventId?._id;
      console.log('from EventTicket',eventId)
      const response = await fetchSingleEvent(eventId as string);
      setEvent(response?.data.events);
    }
    getEvent();
  }, [booking]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const handeTicketDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      setHideImage(true);
      setHiddenDownloadMode(true);
      await new Promise((res) => setTimeout(res, 300)); 

      const node = printRef.current;
      if (!node) return;

      const dataUrl = await domtoimage.toPng(node, {
        cacheBust: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = pdfWidth * 0.85;
        let imgHeight = (img.height * imgWidth) / img.width;

        const maxHeight = pdfHeight * 0.9;
        if (imgHeight > maxHeight) {
          const scale = maxHeight / imgHeight;
          imgHeight = maxHeight;
          imgWidth = imgWidth * scale;
        }

        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;

        pdf.addImage(dataUrl, "PNG", x, y, imgWidth, imgHeight);
        pdf.save(`NestEve-Ticket-${event?.title || "download"}.pdf`);
      };
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      setHideImage(false);
      setHiddenDownloadMode(false);
    }
  };



  const TicketContent = ({ isPrint = false }: { isPrint?: boolean }) => (
    <div
      className="w-[500px] bg-gradient-to-br from-gray-900  to-black rounded-lg overflow-hidden border border-white/20 shadow-xl"
      ref={isPrint ? printRef : ticketRef}
      style={{
        margin: "auto",
      }}
    >
    
      <div className="relative py-3 px-4 bg-gradient-to-r from-purple-800 to-blue-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ticket size={18} />
            <span className="font-bold text-lg">EVENT TICKET</span>
          </div>
          <div className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
            {booking?.status}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1">
          <div className="flex justify-between">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white/50 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

     
      {!hideImage && (
        <div className="relative w-full h-40 text-white">
          <img
            src={event?.image || "/api/placeholder/400/320"}
            crossOrigin="anonymous"
            alt={event?.title || "Event"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute top-3 left-3 bg-black/70 text-xs px-2 py-1 rounded-full">
            {event?.category?.categoryName || "Event"}
          </div>
          <div className="absolute top-3 right-3 bg-yellow-600 text-black font-bold text-xs px-3 py-1 rounded-full">
            VIP PASS
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h2 className="font-bold text-xl">{event?.title || "Loading event..."}</h2>
          </div>
        </div>
      )}

    
      <div className="p-4 space-y-5 text-white">
        <div className="flex space-x-50">
          <div className="flex-1 flex items-start space-x-2">
            <Calendar className="text-blue-400 mt-1" size={16} />
            <div>
              <div className="text-xs text-gray-400">Date</div>
              <div className="text-sm font-medium">
                {event?.startDate ? formatDate(event.startDate) : "Loading..."}
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-start space-x-2">
            <Clock className="text-blue-400 mt-1" size={16} />
            <div>
              <div className="text-xs text-gray-400">Time</div>
              <div className="text-sm font-medium">{event?.startTime || "TBA"}</div>
            </div>
          </div>
        </div>

        <div className="flex space-x-50">
          <div className="flex-1 flex items-start space-x-2">
            <MapPin className="text-blue-400 mt-1" size={16} />
            <div>
              <div className="text-xs text-gray-400">Venue</div>
              <div className="text-sm font-medium">{ "TBA"}</div>
            </div>
          </div>
          <div className="flex-1 flex items-start space-x-2">
            <Star className="text-yellow-400 mt-1" size={16} fill="currentColor" />
            <div>
              <div className="text-xs text-gray-400">Rating</div>
              <div className="text-sm font-medium">4.8/5.0</div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 my-2"></div>

        <div className="grid grid-cols-2 gap-60 text-sm">
          <div>
            <div className="text-xs text-gray-400">Payment Method</div>
            <div className="font-medium">{booking?.paymentMethod}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Payment Status</div>
            <div
              className={`font-medium ${
                booking?.paymentStatus === "paid" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              {booking?.paymentStatus}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 my-2"></div>

        {booking?.tickets?.map((ticket, index) => (
          <div key={index} className="grid grid-cols-2 gap-x-60 gap-y-4 text-sm">
            <div>
              <div className="text-xs text-gray-400">ticket type</div>
              <div className="font-medium">{ticket.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">ticket price</div>
              <div className="font-medium">{ticket.price}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Quantity</div>
              <div className="font-medium">{ticket.quantity}</div>
            </div>

            {ticket.selectedSeats && ticket.selectedSeats.length > 0 ? (
              <div>
                <div className="text-xs text-gray-400">Seats</div>
                <div className="font-medium">
                  {ticket.selectedSeats.filter((seat) => seat?.id).map((seat) => seat.id).join(", ")}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-xs text-gray-400">Seated</div>
                <div className="font-medium">No</div>
              </div>
            )}
          </div>
        ))}

        <div className="border-t border-white/10 my-2"></div>

        {/* QR Code */}
        <div className="flex items-center justify-center py-2">
          <div className="flex flex-col items-center">
            <QrCode size={100} className="text-white" />
            <div className="text-xs text-gray-400 mt-2">Scan to verify ticket</div>
          </div>
        </div>

        {/* Actions */}
        {!hiddenDownloadMode && (
          <div className="flex justify-between gap-3 mt-4">
            <button
              onClick={handeTicketDownload}
              className="flex-1 border-blue-600 border-1 text-white text-sm py-2 px-4 font-medium transition"
            >
              Download
            </button>
           
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
     {hiddenDownloadMode && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: -1,
      width: "210mm",
      height: "297mm",
      backgroundColor: "white", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    ref={printRef}
  >
    <div style={{ transform: "scale(1)", transformOrigin: "center" }}>
      <TicketContent isPrint />
    </div>
  </div>
)}

        <TicketContent />
     
    </>
  );
};

export default PublicTicketViewPage
