import React from 'react'
import bg from '../../../assets/abstract-background.jpg'
import { div } from 'framer-motion/client'

const AuthProcessLayouts = () => {
    return (


        
            <div className="h-screen flex items-center justify-center  text-white p-8 bg-cover bg-center"style={{ backgroundImage: `url(${bg})` }}>
                <div className='absolute inset-0 bg-black/50'></div>
                <div className= ' bg-black/70 h-3/4  w-2/4 border-white border-2'>
                    
                </div>

            </div>

        
    )
}

export default AuthProcessLayouts
