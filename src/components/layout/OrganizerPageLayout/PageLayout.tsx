
import { ReactNode } from 'react';
import Navbar from '../../common/Navbar/Navbar';
import bg from '../../../assets/abstract-background.jpg';

const PageLayout:React.FC<{children:ReactNode}> = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <Navbar/>
        <div className="relative z-10 flex flex-col md:flex-row flex-grow mt-16 sm:mt-20 md:mt-24 lg:mt-28 mx-2 sm:mx-4 md:mx-5 mb-6 sm:mb-8 md:mb-10">
          {children}
        </div>

      </div>
  )
}

export default PageLayout

