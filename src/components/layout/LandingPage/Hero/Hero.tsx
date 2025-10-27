import hero from '@/assets/hero.jpg';
import Navbar from '../../../common/Navbar/Navbar';
import Button from '../../../ui/LandingPage/Button/Button';


const Hero = () => {
  
 

  return (
    <div className="relative h-screen flex flex-col">

      <div className="absolute inset-0">
        <img src={hero} alt="concert crowd" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
      </div>


      <Navbar  />
      

      <div className="relative top-15 z-10 flex flex-col justify-center h-full px-4 sm:px-6 md:px-12 lg:px-20">

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl my-4 sm:my-6 md:my-8 text-white leading-tight font-roboto font-light text-center md:text-left">
          Where every event <br className="hidden sm:block" /> becomes a story <br className="hidden sm:block" /> worth telling !
        </h1>


        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 md:mb-8 max-w-2xl text-white bg-black/30 p-3 sm:p-4 md:p-5 rounded-md text-center md:text-left">
          Discover a platform where planning your event is seamless and exciting!
          We offer tailored services to turn your vision into reality.
          <br className="hidden md:block" /><br className="hidden md:block" />
        <div className="mt-4 md:mt-6 md:ml-0">
          <Button variant="outline">Discover more</Button>
        </div>
        </p>

      </div>
    </div>
  );
};

export default Hero;
