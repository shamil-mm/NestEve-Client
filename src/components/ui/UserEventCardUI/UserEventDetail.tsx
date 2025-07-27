
import { useEffect, useMemo, useState } from 'react';
import { Calendar, Clock, MapPin, Armchair, MessagesSquare, Trash2, Pencil, } from 'lucide-react';
import { IEvent, IOrganizer } from '../../../interfaces/IEvent';
import NonseatedCheckout from '../Checkout/NonseatedCheckout';
import SeatSelectionModal from '../../layout/Modal/SeatSelectionModal';
import { ITicket } from '../Checkout/NonseatedCheckout';
import CreatePostModal from '../../layout/Modal/CreatePostModal';
import PostsCarousel from '../../layout/PostLayout/PostsCarousel';
import { fetchPosts } from '../../../services/content_codService';
import { IPost } from '../../../interfaces/Ipost';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/AuthHook';
import { setSelectedOrganizer } from '../../../store/slices/chat';
import { getGeoAddress } from '../../../utils/geocode';
import { StaticMap } from '../../common/Location/StaticMap';
import CreateReviewModal from '../../layout/Modal/CreateReviewModal';
import { editReviews, fetchReviews, removeReviews } from '../../../services/EventServices';
import { IReview } from '../../../interfaces/Ireview';
import Swal from 'sweetalert2';
import { toast } from 'react-fox-toast';
import { checkReviewEligibility } from '../../../services/bookingService';




interface UserEventDetailProps {
  event: IEvent
  close: (value: boolean) => void;
  checkoutmodalfn(value: boolean): void
}
interface IupdatedData { selectedSeats: [], totalSeatPrice: string, cate: string, seatcount: number }
const UserEventDetail: React.FC<UserEventDetailProps> = ({ event, close, checkoutmodalfn }) => {
  const id = useAppSelector((state) => state.authUser?.user?.id)

  const [showModal, setShowModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showEditReviewModal, setShowEditReviewModal] = useState(false)
  const [tickets, setTickets] = useState<ITicket[] | []>([])
  const [currentTicket, setCurrentTicket] = useState<ITicket | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<boolean>(false)
  const [post, setPost] = useState<Partial<IPost>[]>([])
  const [reviews, setReviews] = useState<Partial<IReview>[]>([])
  const navigate = useNavigate()
  const dispatch = useAppDispatch()


  const [reviewPage, setReviewPage] = useState(1);
const [reviewLimit] = useState(2); 
const [reviewTotal, setReviewTotal] = useState(0);
const [refreshTrigger, setRefreshTrigger] = useState(0);
const [selectedReviewForEdit, setSelectedReviewForEdit] = useState<Partial<IReview> | null>(null);
const [canReview,setCanReview]=useState<boolean>(false)


const totalPages = Math.ceil(reviewTotal / reviewLimit);

const pages = useMemo(() => {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}, [totalPages]);


  const [address, setAddress] = useState('');

  const setReviewFn = (newReview: IReview,label:string) => {
    if(label=='create'){
      setReviews(prev => [...prev, newReview])
      setRefreshTrigger(prev=>prev+1)
    }else{
      setReviews((prev) =>
        prev.map((review)=>
          review._id===newReview._id?newReview:review
        )
      )
      setRefreshTrigger(prev=>prev+1)

    }
  }

  useEffect(() => {
    const FetchReviews = async () => {
      const res = await fetchReviews(event._id as string,reviewPage,reviewLimit)
      if (res?.data.result) {
        setReviews(res?.data.result)
        setReviewTotal(res?.data.totalReview)
      }
    }
    FetchReviews()
  }, [reviewLimit,reviewPage,refreshTrigger])

  useEffect(() => {
    const fetchAddress = async () => {
      if (event.location.coordinates) {
        const result = await getGeoAddress(event.location.coordinates[1], event.location.coordinates[0]);
        setAddress(result);
      }
    };
    fetchAddress();
  }, [event]);

  useEffect(() => {
    async function fetchposts() {
      const response = await fetchPosts(event._id as string);
      setPost(response?.data?.posts);
    }
    if (event._id) {
      fetchposts();
    }
  }, [event._id]);




  const [updatedData, setUpdatedData] = useState<IupdatedData | {}>({})

  useEffect(() => {
    if (checkoutModal) {
      checkoutmodalfn(true)
    }


  }, [checkoutModal, checkoutmodalfn])

  const selectedSeatfunc = (selectedSeats: [], totalSeatPrice: string, cate: string, seatcount: number) => {
    const data = { selectedSeats, totalSeatPrice, cate, seatcount }
    setUpdatedData(data)
    setShowModal(false)
  }

  const modalfn = (value: boolean, Tickets: ITicket[], selectedTicket: ITicket) => {
    setCurrentTicket(selectedTicket)
    setTickets(Tickets)
    setShowModal(value)
  }
  function CreatePostFN() {
    setShowPostModal(prev => !prev)
  }
  function CreateReviewFN() {
    if(!canReview){
      toast.warning("You can only review this event if you have booked and attended it")
      return
    }
    setShowReviewModal(prev => !prev)
  }
  function closeFN(value: boolean) {
    setShowPostModal(value)
    setShowReviewModal(value)
    setShowEditReviewModal(value)
    setSelectedReviewForEdit(null)
  }

  useEffect(()=>{
   async function CheckReviewEligibility(){
    const res=await checkReviewEligibility(id as string,event._id as string)
    if(res)setCanReview(res)
   }
   CheckReviewEligibility()

  },[])
  useEffect(() => {

    if (showPostModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showPostModal]);



  if (showModal) {
    return (
      <SeatSelectionModal event={event} tickets={tickets} ticket={currentTicket as ITicket} selectFN={selectedSeatfunc} />
    )
  }

  const handleEditReview=async(review:Partial<IReview>)=>{
     setSelectedReviewForEdit(review)
    setShowEditReviewModal(prev => !prev)
    
  }
  const handleDeleteReview = async (reviewId: string) => {
    const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this review?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });
     if (result.isConfirmed) {
      const res = await removeReviews(reviewId as string)
      const removedId = res?.deletedReviewId
      setReviews(prev => prev.filter((review) => review._id !== removedId))
      setRefreshTrigger(prev=>prev+1)
     }
  
    
  }

  const handleChat = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const organizerData: IOrganizer = {
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
        <button onClick={handleChat} className="flex items-center gap-2 px-2 rounded-sm m-2 border-white border-1 py-1">
          <span><MessagesSquare /></span> chat with Organizer
        </button>
        <button onClick={() => close(false)} className="px-2 rounded-sm m-2 border-white border-1 py-1">
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


      <div className={`grid grid-cols-1 ${ new Date(event.endDate) >= new Date()?"md:grid-cols-3":"md:grid-cols-2"}  gap-4 p-6  border border-white`}>

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
            <MapPin className="h-4 w-4 mr-1 text-blue-400" />
            <h2 className="text-sm text-white uppercase tracking-wider">Location</h2>
            <div className="flex items-center mt-1">

              <p>{address}</p>
            </div>
          </div>
          <div>
            <h2 className="text-sm text-white uppercase tracking-wider">Event tags </h2>
            <div className="flex items-center mt-1">
              {
                event.tags.map((value, index) => (
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

              <Armchair className="h-4 w-4 mr-2" />
              <p>{event.is_seated ? "Yes" : "No"}</p>
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
                      <p>₹{cat.price} : {cat.rowRange}</p>
                    </div>

                  </div>
                ))
              ) : (
                event.ticketTypes.map((ticket, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <p>{ticket.name} - </p> &nbsp;
                    <p>₹ {ticket.price}</p>
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
                    <p>{ticket.capacity} seats</p>
                  </div>
                ))
              }
            </div>
          </div>


        </div>

        {new Date(event.endDate)>=new Date() && (
          <NonseatedCheckout event={event} modalfn={modalfn} newTickets={tickets} updatedData={updatedData as IupdatedData} checkoutModal={setCheckoutModal} />
        )}




      </div>

      <br />
      <div className=" bg-black/800">
        <div
          className="h-48 bg-gray-300 cursor-pointer relative overflow-hidden"

        >

          <div className="absolute inset-0 flex items-center justify-center text-white z-10">
            <StaticMap latitude={event.location.coordinates[1]} longitude={event.location.coordinates[0]} />
          </div>

        </div>
      </div>
      <div className=" bg-black/800">
        <br />

        {/* review */}
        <div className="py-4 px-6 border border-white">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold">Event Reviews</h1>
          </div>
          {canReview&&(
            <div className="flex justify-end items-center z-10">

            <button onClick={CreateReviewFN} className="p-2 mb-2 uppercase text-sm bg-black border-2 border-blue-700 rounded-sm text-white">
              Mark Your Review
            </button>
            {showReviewModal && (<CreateReviewModal eventId={event._id} close={closeFN} newReview={setReviewFn} label='create' />)}
          </div>

          )}
          
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-center">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="border border-gray-200 rounded-sm px-4 py-4  shadow-sm flex items-center justify-between"
                >

                  <div className="flex flex-col text-left min-w-[150px]">
                    <span className="text-white font-semibold">
                      {(review.userId as { name: string })?.name || 'Anonymous'}
                      <span className="text-gray-400 text-xs px-2">
                        {new Date(review.createdAt!).toLocaleTimeString()}
                      </span>
                    </span>

                  </div>
                  <div className="flex-1 text-center px-4 text-white">
                    {review.review || 'No text provided.'}
                  </div>
                  <div className="flex items-center gap-2 min-w-[120px] justify-end">
                    <div className="text-yellow-500 font-bold text-right hover:text-yellow-400 hover:scale-120 transition-transform duration-200 cursor-pointer">
                      {'⭐'.repeat(review.rating!)}
                    </div>
                    <button
                      onClick={()=>handleEditReview(review)}
                      className="text-sm px-5"
                      title="Delete Review"
                    >  
                      <Pencil color='yellow' size={15} />
                    </button>
                          {showEditReviewModal && (<CreateReviewModal eventId={event._id} close={closeFN} newReview={setReviewFn} label='edit' existingReview={selectedReviewForEdit!}/>)}
                    <button
                      onClick={() => handleDeleteReview(review._id as string)}
                      className="text-red-500 hover:text-red-700 text-sm px-1"
                      title="Delete Review"
                    >
                      <Trash2 color='red' size={15} />
                    </button>
                  </div>
                </div>

              ))
            )}
          </div>
          

        {totalPages && (
  <div className="flex justify-center items-center mt-6 space-x-2">
    <button
      className="px-3 py-1 border rounded disabled:opacity-50 "
      disabled={reviewPage === 1}
      onClick={() => setReviewPage((prev) => Math.max(prev - 1, 1))}
    >
      Prev
    </button>

    {pages.map((page) => (
      <button
        key={page}
        className={`px-3 py-1 border rounded ${
          reviewPage === page ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => setReviewPage(page)}
      >
        {page}
      </button>
    ))}

    <button
      className="px-3 py-1 border rounded disabled:opacity-50"
      disabled={reviewPage === totalPages}
      onClick={() => setReviewPage((prev) => Math.min(prev + 1, totalPages))}
    >
      Next
    </button>
  </div>
)}


        </div>
        <br />

        {/* post */}

        <div className="py-4 px-6 border border-white">
          <div className="flex justify-center items-center">
            <h1 className="text-2xl font-bold">Event Posts</h1>
          </div>
          <div className="flex justify-end items-center z-10">
            <button onClick={CreatePostFN} className="p-2 uppercase text-sm bg-black border-2 border-blue-700 rounded-sm text-white">
              Create Your Post
            </button>
            {showPostModal && (<CreatePostModal event={event} close={closeFN} purpose={"create"} />)}
          </div>

          {post && post.length > 0 ?
            (<div className="flex justify-center items-center">
              <PostsCarousel event={event} />
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
