import EventCard from "./EventCard"
import SectionTitle from "../../../ui/LandingPage/SectionTitle/SectionTitle"
import Button from "../../../ui/LandingPage/Button/Button";



const UpcomingEvents = () => {
    const events = [
        {
          id: 1,
          title: "ByeMoon Party",
          description: `Get ready to light up the night! 🌕 Join us for the electrifying Bye Moon Party on December 31, 2024. Let’s welcome
          the New Year with music, dance, and unforgettable memories. Don’t miss it!`,
          date: "DEC 31, 2024",
          startDate: "2024-12-31", 
          eventTime: "21:00", 
          doortime: "20:00", 
          image: "/api/placeholder/400/300",
          capacity: 500,
          time: "20:00",
          category: "NIGHT LIFE",
        },
        {
          id: 1,
          title: "ByeMoon Party",
          description: `Get ready to light up the night! 🌕 Join us for the electrifying Bye Moon Party on December 31, 2024. Let’s welcome
          the New Year with music, dance, and unforgettable memories. Don’t miss it!`,
          date: "DEC 31, 2024",
          startDate: "2024-12-31", 
          eventTime: "21:00", 
          doortime: "20:00", 
          image: "/api/placeholder/400/300",
          capacity: 500,
          time: "20:00",
          category: "NIGHT LIFE",
        },
        {
          id: 1,
          title: "ByeMoon Party",
          description: `Get ready to light up the night! 🌕 Join us for the electrifying Bye Moon Party on December 31, 2024. Let’s welcome
          the New Year with music, dance, and unforgettable memories. Don’t miss it!`,
          date: "DEC 31, 2024",
          startDate: "2024-12-31", 
          eventTime: "21:00", 
          doortime: "20:00", 
          image: "/api/placeholder/400/300",
          capacity: 500,
          time: "20:00",
          category: "NIGHT LIFE",
        },
        {
          id: 1,
          title: "ByeMoon Party",
          description: `Get ready to light up the night! 🌕 Join us for the electrifying Bye Moon Party on December 31, 2024. Let’s welcome
          the New Year with music, dance, and unforgettable memories. Don’t miss it!`,
          date: "DEC 31, 2024",
          startDate: "2024-12-31", 
          eventTime: "21:00", 
          doortime: "20:00", 
          image: "/api/placeholder/400/300",
          capacity: 500,
          time: "20:00",
          category: "NIGHT LIFE",
        },
        
      ];
    
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <SectionTitle 
        section={{
          title:"Upcoming Events",
          description:"Discover exciting events happening near you"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
      <Button variant="outline">ALL EVENTS</Button>
      </div>
    </section>
  )
}

export default UpcomingEvents
