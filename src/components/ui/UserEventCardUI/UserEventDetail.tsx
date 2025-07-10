
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Armchair, MessagesSquare,  } from 'lucide-react';
import { IEvent, IOrganizer } from '../../../interfaces/IEvent';
import NonseatedCheckout from '../Checkout/NonseatedCheckout';
import SeatSelectionModal from '../../layout/Modal/SeatSelectionModal';
import { ITicket } from '../Checkout/NonseatedCheckout';
import CreatePostModal from '../../layout/Modal/CreatePostModal';
import PostsCarousel from '../../layout/PostLayout/PostsCarousel';
import { fetchPosts } from '../../../services/content_codService';
import { IPost } from '../../../interfaces/Ipost';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks/AuthHook';
import { setSelectedOrganizer } from '../../../store/slices/chat';




interface UserEventDetailProps{
    event:IEvent
    close: (value:boolean) => void;
    checkoutmodalfn(value:boolean):void
}
interface IupdatedData{selectedSeats:[], totalSeatPrice: string, cate: string, seatcount: number}
const UserEventDetail:React.FC<UserEventDetailProps> = ({event,close,checkoutmodalfn}) => {
   
    const [showModal,setShowModal]=useState(false)
    const [showPostModal,setShowPostModal]=useState(false)
    const [showMap, setShowMap] = useState(false);
    const [tickets,setTickets]=useState<ITicket[] |[]>([])
    const [currentTicket,setCurrentTicket]=useState<ITicket|null>(null)
    const [checkoutModal,setCheckoutModal]=useState<boolean>(false)
    const [post,setPost]=useState<Partial<IPost>[]>([])
  const navigate=useNavigate()
  const dispatch=useAppDispatch()

    useEffect(() => {
        async function fetchposts() {
          const response = await fetchPosts(event._id as string);
          setPost(response?.data?.posts);
        }
        if (event._id) {
          fetchposts();
        }
      }, [event._id]);
    



    const [updatedData,setUpdatedData]=useState<IupdatedData|{}>({})

    useEffect(()=>{
      if(checkoutModal){
        checkoutmodalfn(true)
      }
  

    },[checkoutModal,checkoutmodalfn])
   
      const selectedSeatfunc=(selectedSeats:[],totalSeatPrice:string,cate:string,seatcount:number)=>{
        const data={selectedSeats,totalSeatPrice,cate,seatcount}
        setUpdatedData(data)
        setShowModal(false)
      }

    const modalfn=(value:boolean,Tickets:ITicket[],selectedTicket:ITicket)=>{
      setCurrentTicket(selectedTicket)
      setTickets(Tickets)
      setShowModal(value)
    }
    function CreatePostFN(){
      setShowPostModal(prev=>!prev)
    }
    function closeFN(value:boolean){
      setShowPostModal(value)
    }
    useEffect(() => {
      if (showPostModal) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return () => document.body.classList.remove("overflow-hidden");
    }, [showPostModal]);


    
    if(showModal){
      return(
        <SeatSelectionModal event={event} tickets={tickets} ticket={currentTicket as ITicket} selectFN={selectedSeatfunc} />
      )
    }

    const handleChat=(e:React.MouseEvent<HTMLButtonElement>)=>{
      e.preventDefault()
      
        const organizerData:IOrganizer = {
      _id: event.organizerId._id,
      name: event.organizerId.name,
      avatarUrl: event.organizerId.avatarUrl,
      email: event.organizerId.email,
    };
    
     dispatch(setSelectedOrganizer(organizerData))
      navigate('/chats')
    }
  return (

        <div className="w-full mx-auto bg-black/800 text-white  overflow-hidden shadow-xl ">
          <div className='flex justify-end'>
          <button  onClick={handleChat} className="flex items-center gap-2 px-2 rounded-sm m-2 border-white border-1 py-1">
            <span><MessagesSquare /></span> chat with Organizer
            </button>  
          <button onClick={()=>close(false)} className="px-2 rounded-sm m-2 border-white border-1 py-1">
            &larr; back
            </button>  

          </div>
            
         

          <div className="relative h-64 overflow-hidden border border-white ">
          <img
            src={event.image}
            alt="Event"
            className="absolute inset-0 w-full h-full object-cover -z-1 p-2"
        />
            
          </div>
          <br />
    
        
          <div className="text-center py-4 px-6 border border-white">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <p className="mt-2 text-gray-300"> {event.description} </p>
          </div>
          <br />
    
       
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6  border border-white">
         
            <div className="space-y-4">
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Start Date</h2>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <p>{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Time</h2>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <p>{event.startTime}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Status</h2>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                    {event.status}
                  </span>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Venue</h2>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <p>{event.venue}</p>
                </div>
              </div>
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Location</h2>
                <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1 text-blue-400" />
                <p>{event.locationName}</p>
                </div>
              </div>
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Event tags </h2>
                <div className="flex items-center mt-1">
                 {
                  event.tags.map((value,index)=>(
                    <span key={index} className='border-white border-1 rounded-sm m-1 px-1'>{value.tag} </span>
                  ))
                 }
                </div>
              </div>
            </div>
        
            <div className="space-y-4">
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">End Date</h2>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <p>{new Date(event.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">End Time</h2>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2" />
                  <p>{new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Category</h2>
                <div className="flex items-center mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-900 text-purple-300">
                    {event.category.categoryName}
                  </span>
                </div>
              </div>
              
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Is seated ?</h2>
                <div className="flex items-center mt-1">
                  
                  <Armchair className="h-4 w-4 mr-2"/>
                  <p>{event.is_seated?"Yes":"No"}</p>
                </div>
              </div>
              
              
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Price per seat</h2>
                <div className="flex items-center mt-1">
                  
                 
                 {event.is_seated ? (
                      event.layoutConfig.categories.map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                            <Armchair className="h-4 w-4 text-blue-400" />
                            <p>{cat.name}</p>
                            <p>${cat.price} - {cat.rowRange} seats </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      event.ticketTypes.map((ticket, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <p>{ticket.name} - </p> &nbsp;
                          <p>₹ {ticket.price }</p>
                        </div>
                      ))
                 )}
                </div>
              </div>
              <div>
                <h2 className="text-sm text-white uppercase tracking-wider">Avaliable Seats Count </h2>
                <div className="flex items-center mt-1">
                 {
                     event.ticketTypes.map((ticket, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <p>{ticket.name} - </p>
                        &nbsp;
                        <p>{ticket.capacity } seats</p>
                      </div>
                    ))
                 }
                </div>
              </div>
             
             
            </div>
              
              <NonseatedCheckout event={event} modalfn={modalfn} newTickets={tickets} updatedData={updatedData as IupdatedData} checkoutModal={setCheckoutModal}/>
            


          </div>
    
          <br />
          <div className=" bg-black/800">
            <div 
              className="h-48 bg-gray-300 cursor-pointer relative overflow-hidden"
              onClick={() => setShowMap(!showMap)}
            >
              {showMap ? (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Interactive map would load here
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  Click to load map
                </div>
              )}
            </div>
          </div>
          <div className=" bg-black/800">
          <br />
          <div className="py-4 px-6 border border-white">
          <div className="flex justify-center items-center">
              <h1 className="text-3xl font-bold">Event Posts</h1>
          </div>
          

            <div className="flex justify-end items-center z-10">
              <button onClick={CreatePostFN} className="p-2 uppercase text-sm bg-black border-2 border-blue-700 rounded-sm text-white">
                Create Your Post
              </button>
              {showPostModal && (<CreatePostModal event={event} close={closeFN} purpose={"create"}/>)}
            </div>
            
            {post &&  post.length>0 ?
            ( <div className="flex justify-center items-center">
              <PostsCarousel event={event}/>
            </div>)
            :
            (<div className="flex justify-center items-center">
            <p className=" font-bold">There is no post yet !!!. leave your post here.</p>
          </div>)
          }
           
          </div>

          </div>
         
        </div>

  )
}

export default UserEventDetail
