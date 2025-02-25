
import Hero from '../../components/layout/LandingPage/Hero/Hero'
import UpcomingEvents from '../../components/layout/LandingPage/UpcomingEvents/UpcomingEvents'
import ExploreCategories from '../../components/layout/LandingPage/ExploreCategories/ExploreCategories'
import LatestPosts from '../../components/layout/LandingPage/LatestPosts/LatestPosts'
import EventSearch from '../../components/layout/LandingPage/EventSearch/EventSearch'
import Footer from '../../components/common/Footer/Footer'
const LandingPage = () => {
  return (
    <div className='min-h-screen bg-black test-white'>
      <Hero/>
      <UpcomingEvents/>
      <ExploreCategories/>
      <EventSearch/>
      <LatestPosts/>
      <Footer/> 
    </div>
  )
}

export default LandingPage
