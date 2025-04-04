import { useState } from "react"

interface CreateTagModalProps{
    isOpen:boolean;
    
    children:React.ReactNode
}
const CreateTagModal:React.FC<CreateTagModalProps> = ({isOpen ,children}) => {
    const [tabIndex]=useState(-1)
    if(!isOpen)return null
  return (
    <>
     <div className="fixed inset-0 bg-black/50 bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          
          {children}
        </div>
      </div>
    </>
  )
}

export default CreateTagModal
