// 

import SectionTitle from '../../../ui/LandingPage/SectionTitle/SectionTitle';
import PostCard from './PostCard';
import artgalary from '../../../../assets/artgalary.jpg';
import techpresentation from '../../../../assets/techpresentation.jpg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; 
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules'; 
import { ArrowLeft, ArrowRight } from 'lucide-react'; 

const LatestPosts = () => {
  const posts = [
    {
      id: 1,
      title: 'What an Unforgettable Night! 🔥',
      description: 'Thank you to everyone who joined us for an event beyond! From the incredible performances to the vibrant energy, the night was nothing short of magical!',
      image: artgalary,
      tags: ['EventHighlights', 'UnforgettableMoments', 'LiveMusic']
    },
    {
      id: 2,
      title: 'Agrah Conference Center',
      description: 'Get ready to light up the night! Join us for the electrifying Bye Moon Party on December 31, 2024.',
      image: techpresentation
    },
    {
      id: 3,
      title: 'Agrah Conference Center',
      description: 'Get ready to light up the night! Join us for the electrifying Bye Moon Party on December 31, 2024.',
      image: artgalary
    }
  ];

  return (
    <section className="py-20 bg-black ">
      <div className="container mx-auto px-4 relative "> 
        <SectionTitle 
          section={{
            title: "Latest Posts", 
            description: "Stay updated with our recent activities and events"
          }}
        />
        
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          navigation={{ 
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          modules={[EffectCoverflow, Pagination, Navigation]} 
          className="mySwiper"
        >
          {posts.map(post => (
            <SwiperSlide key={post.id}>
              <PostCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>

      
        <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-black/100 !rounded-full !flex !items-center !justify-center hover:!bg-black/70 transition-all">
          <ArrowLeft className="w-6 h-6" /> 
        </div>
        <div className="swiper-button-next !text-white !w-12 !h-12 !bg-black/50 !rounded-full !flex !items-center !justify-center hover:!bg-black/70 transition-all">
          <ArrowRight className="w-6 h-6" /> 
        </div>
        <style>
        {`
          .swiper-button-next:after,
          .swiper-button-prev:after {
            display: none; /* Hide Swiper's default arrow icons */
          }
        `}
      </style>
      </div>
    </section>
  );
};

export default LatestPosts;