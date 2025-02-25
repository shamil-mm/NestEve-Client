
// import Logo from '@/components/ui/Logo';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import byemoon from '../../../assets/byemoon.jpg'
import party from '../../../assets/hero.jpg'

const Footer = () => {
  return (
    <footer className="border-[#2f00ff] border-2 py-5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
          <div  className='p-10'>
            {/* <Logo /> */}
            <img src="/logo.png" alt="logo" className="w-28 md:w-36 lg:w-40" />
            <p className="mt-4 text-gray-400 max-w-md">
              Your ultimate destination for planning and discovering unforgettable events! 
              From music festivals to workshops and themed gatherings, we connect you to 
              experiences that inspire. Start creating lasting memories today.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Latest Posts</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 rounded p-2">
                  <img src={byemoon} alt="Post" className="w-full h-auto rounded" />
                  <p className="text-xs mt-2">Agrah Conference Center</p>
                </div>
                <div className="bg-white/80 rounded p-2">
                  <img src={party} alt="Post" className="w-full h-auto rounded" />
                  <p className="text-xs mt-2">Agrah Conference Center</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">CONTACT</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-nBlue" />
                  <span>Walking Street, Los Angeles, California, USA</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-nBlue" />
                  <a href="mailto:info@eventemp.com">info@eventemp.com</a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-nBlue" />
                  <a href="tel:+1-312-6912">+90 312 69 12</a>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-nBlue" />
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
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} NestEve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;