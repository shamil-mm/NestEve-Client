
// import Logo from '@/components/ui/Logo';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import byemoon from '../../../assets/byemoon.jpg'
import party from '../../../assets/hero.jpg'

const Footer = () => {
  return (
    <footer className="border-[#2f00ff] border-2 py-5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8">
          <div className='p-4 sm:p-6 md:p-10'>
            {/* <Logo /> */}
            <img src="/logo.png" alt="logo" className="w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40" />
            <p className="mt-4 text-sm sm:text-base text-gray-400 max-w-md">
              Your ultimate destination for planning and discovering unforgettable events!
              From music festivals to workshops and themed gatherings, we connect you to
              experiences that inspire. Start creating lasting memories today.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4">Latest Posts</h4>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/80 rounded p-2 sm:p-3">
                  <img src={byemoon} alt="Post" className="w-full h-auto rounded" />
                  <p className="text-xs sm:text-sm mt-2">Agrah Conference Center</p>
                </div>
                <div className="bg-white/80 rounded p-2 sm:p-3">
                  <img src={party} alt="Post" className="w-full h-auto rounded" />
                  <p className="text-xs sm:text-sm mt-2">Agrah Conference Center</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4">CONTACT</h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-nBlue mt-1 flex-shrink-0" />
                  <span>Walking Street, Los Angeles, California, USA</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-nBlue flex-shrink-0" />
                  <a href="mailto:info@eventemp.com">info@eventemp.com</a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-nBlue flex-shrink-0" />
                  <a href="tel:+1-312-6912">+90 312 69 12</a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-nBlue flex-shrink-0" />
                  <a href="tel:+1-555-2157020">+55 215 70 20</a>
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-nBlue">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-nBlue">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-nBlue">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} NestEve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;