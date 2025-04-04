
import { ReactNode } from 'react';
import SecondNavbar from '../../common/Navbar2/SecondNavbar';
import bg from '../../../assets/abstract-background.jpg';

const PageLayout:React.FC<{children:ReactNode}> = ({children}) => {
  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: `url(${bg})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <SecondNavbar/>
        <div className="relative z-10 flex flex-row flex-grow mt-28 mx-5 mb-10">
          {children}
        </div>

      </div>
  )
}

export default PageLayout

