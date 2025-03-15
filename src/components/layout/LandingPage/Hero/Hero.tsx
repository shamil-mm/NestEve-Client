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


      <Navbar />

      <div className="relative top-15 z-10 flex flex-col justify-center h-full px-6 md:px-20">

        <h1 className="text-5xl md:text-6xl lg:text-7xl my-8 text-white leading-tight font-roboto font-light text-center md:text-left">
          Where every event <br /> becomes a story <br /> worth telling !
        </h1>


        <p className="text-lg text-center md:text-xl lg:text-2xl mb-8 max-w-2xl text-white bg-black/30 p-5 rounded-md">
          Discover a platform where planning your event is seamless and exciting!
          We offer tailored services to turn your vision into reality.
          <br /><br />
        <Button variant="outline">Discover more</Button>
        </p>

      </div>
    </div>
  );
};

export default Hero;
