import EventCard from "./EventCard"
import SectionTitle from "../../../ui/LandingPage/SectionTitle/SectionTitle"
import Button from "../../../ui/LandingPage/Button/Button";
import { useEffect, useState } from "react";
import { fetchAllEvents } from "../../../../services/EventServices";
import { IEvent } from "../../../../interfaces/IEvent";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../../hooks/AuthHook";
import { checkUserLocation } from "../../../../services/authServices";



const UpcomingEvents = () => {

  const [events, setEvents] = useState<IEvent[]>([])
  const userId = useAppSelector((state) => state.authUser.user?.id)
  const [location, setLocation] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const navigate = useNavigate()


  useEffect(() => {
    const CheckLocation = async () => {
      const response = await checkUserLocation(userId as string)
      if (response?.lat && response?.lng) {
        setLocation({ lat: response.lat, lng: response.lng })
      } else {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              setLocation({ lat: latitude, lng: longitude })
            },
            (error) => {
              console.log('error getting browser locatioin', error)
            }, {
            enableHighAccuracy: true, timeout: 10000
          }
          )
        } else {
          console.log('geo location not supported by this browser')
        }
      }
    }
    if (userId) {
      const timer=setTimeout(()=>{
        CheckLocation()
      },60000)
      return ()=>clearTimeout(timer)
    }
  }, [userId])

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetchAllEvents(location?.lat as number, location?.lng as number)
        if (response?.data.events) {
          setEvents(response?.data.events)
        }
      } catch (error) {
        console.log('error in fetch event from upcoming events')
      }

    }

    fetchEvent()
  }, [location])



  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <SectionTitle
          section={{
            title: "Upcoming Events",
            description: "Discover exciting events happening near you"
          }}
        />
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 " >
          <Button variant="outline">ALL</Button>
          <Button variant="outline">ART</Button>
          <Button variant="outline">BUSINESS</Button>
          <Button variant="outline">TECHNOLOGY</Button>
          <Button variant="outline">SPORTS</Button>
          <Button variant="outline">EDUCATION</Button>
          <Button variant="outline">NIGHT LIFE</Button>

        </div>
        <br />



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => { navigate('/search-event') }}>ALL EVENTS</Button>
      </div>
    </section>
  )
}

export default UpcomingEvents
