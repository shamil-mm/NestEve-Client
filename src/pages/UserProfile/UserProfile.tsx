import bg from '../../../src/assets/abstract-background.jpg';
import { useNavigate } from 'react-router-dom';
import useravatar from '../../assets/useravatar.jpg'
import EventCart from '../../components/ui/UserProfile/EventCart';

import { useAppSelector } from "../../hooks/AuthHook";
import { useEffect, useState } from 'react';
import { fetchUserData, getProfileImage } from '../../services/authServices';
import { getUserBookings } from '../../services/bookingService';
import { IBooking } from '../../interfaces/Booking/IBooking';
import EventTicket from '../../components/ui/UserProfile/EventTicket';
import Navbar from '../../components/common/Navbar/Navbar';

const UserProfile = () => {
  const navigate = useNavigate()

  const id = useAppSelector((state) => state.authUser?.user?.id)


  const [currentUser, setCurrentUser] = useState<{ name: string, email: string; avatarUrl: string, role: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [booking, setBooking] = useState<Partial<IBooking>[] | null>(null)
  const [singleBooking, setSingleBooking] = useState<IBooking | null>(null)
  const [ticketModal, setTicketModal] = useState<boolean>(false)
  useEffect(() => {
    const fetchUser = async () => {

      if (id) {
        const getUser = await fetchUserData(id as string)
        setCurrentUser(getUser)
        const response = await getProfileImage(getUser.avatarUrl)
        if (JSON.stringify(response.data.url) !== '{}') {
          setSelectedImage(response.data.url)
        }
      }
    }
    fetchUser()
  }, [id])

  useEffect(() => {
    async function bookingfc() {
      try {
        const res = await getUserBookings(id as string)
        console.log("from bookingfc",res?.data?.data)
        setBooking(res?.data?.data)
      } catch (error) {
        console.log(error);
      }

    }
    bookingfc()
  }, [id])

  const handleTicketModal = (value: boolean, booking: IBooking) => {
    setTicketModal(value)
    setSingleBooking(booking)
  }

  if (ticketModal && singleBooking) {
    return (
      <EventTicket booking={singleBooking} />
    )
  }



  // const favorites = [
  //   { image: nightlife, name: "ByeMoon Party" },
  //   { image: nightlife, name: "Beach Bash" },
  //   { image: nightlife, name: "Sunset Festival" },
  //   { image: nightlife, name: "Sunset Festival" },
  // ];
  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-white bg-cover bg-center" style={{ backgroundImage: `url(${bg})` }}>
      <div className=" relative inset-0  bg-black/50"></div>
      <div className='min-h-auto w-full bg-black test-white relative z-10'>
        <Navbar />
      </div>
      <div className="bg-black/80 w-full max-w-7xl border-white border-1 z-1 mt-20 sm:mt-24 md:mt-30 px-4 sm:px-6 md:px-8">

        <div className="flex flex-col min-h-screen text-white overflow-hidden">
         
          <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
              {/* <h1>{selectedImage}</h1>  */}
              {selectedImage ? (<img src={selectedImage} alt="User avatar" className="w-full h-full object-cover" />) : (<img src={useravatar} alt="User avatar" className="w-full h-full object-cover" />)}
              {/* <img src={useravatar} alt="User avatar" className="w-full h-full object-cover" /> */}
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-center">{currentUser?.name}</h2>
            </div>
            <button onClick={() => { navigate('/edit-profile') }} className="text-xs sm:text-sm border border-blue-700 rounded px-3 py-1.5 sm:py-2 hover:bg-blue-700 transition">
              Manage Profile and Location
            </button>
          </div>

  
          {/* <div className="flex justify-around border-b border-blue/20 py-2">
            <div className="text-center">
              <div className="font-bold">0</div>
              <div className="text-sm text-gray-300">Orders</div>
            </div>
            <div className="text-center">
              <div className="font-bold">1</div>
              <div className="text-sm text-gray-300">Favorites</div>
            </div>
          </div> */}
       
        
          <div className="px-4 py-3 sm:py-4">
            <h2 className="text-lg sm:text-xl font-bold border-b border-white/20 pb-2">Recent Ticket Purchases</h2>
          </div>
          <div className="space-y-3 sm:space-y-4 px-4 pb-4">
            {booking && booking.map((item, index) => (
              <EventCart key={index} booking={item} ticketModal={handleTicketModal} />
            ))}
          </div>

          {/* <div className="px-4 py-2">
            <h2 className="text-xl font-bold border-b border-white/20">Favorites</h2>
          </div>
          <div className="space-y-4 px-4">

            <FavoriteCart favorites={favorites} />

          </div> */}

          {/* Rating and Reviews */}
          {/* <div className="px-4 py-2 border-t border-white/20">
            <RatingAndReview />
            <div className="flex justify-between items-center mb-2">



              <div className="flex gap-1">
                <button className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* <ReviewsList /> */}
          {/* </div> */} 
          {/* Bottom Navigation */}
          {/* <div className="flex justify-around py-3 border-t border-white/20">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">10</button>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
              <ChevronRight size={18} />
            </button>
          </div> */}
        </div>

      </div>

    </div>


  )
}

export default UserProfile
