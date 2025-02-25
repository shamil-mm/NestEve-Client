import SectionTitle from "../../../ui/LandingPage/SectionTitle/SectionTitle"
import Button from "../../../ui/LandingPage/Button/Button"
import EventFilter from "../../../ui/LandingPage/EventFilter/EventFilter"

const EventSearch = () => {
  return (
    <section className="py-10 bg-black ">
      <div className="container mx-auto px-4">
        <SectionTitle 
        section={{
          title:"Discover Events",
          description:"Explore a variety of categories, locations, and dates to find your next unforgettable experience."
        }}
        />
        <div className="max-w-4xl mx-auto mt-12 p-8 border border-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="eg. EVENT NAME"
              className="w-full py-3 px-4 bg-indigo-900/40 border border-indigo-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white"
            />
            <EventFilter label="Category" placeholder="CATEGORY" />
            <EventFilter label="Location" placeholder="LOCATION" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <EventFilter label="Organizer" placeholder="ORGANIZER" />
            <EventFilter label="Status" placeholder="STATUS" />
            <input
              type="date"
              className="w-full py-3 px-4 bg-indigo-900/40 border border-indigo-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white-500"
            />
          </div>
          <div className="flex justify-center">
            <Button variant="primary">SEARCH</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventSearch
