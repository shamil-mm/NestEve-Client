import { useEffect, useState } from "react"

interface IToggleButton{ data: (value:string) => void; }

const ToggleButton:React.FC<IToggleButton> = ({data}) => {
    
    const [selectedRole, setSelectedRole] = useState('user'); 
    

    const handleRoleChange=(role:string)=>{
        setSelectedRole(role)
        data(selectedRole)
    }
    useEffect(()=>{
        data(selectedRole)      
    },[selectedRole])



  return (
    <>
    <div className="flex items-center justify-center">
      <div className="flex border border-gray-300  p-1 mb-3 bg-black shadow-sm">
        {/* User Button */}
        
        <button
          onClick={() => handleRoleChange('user')}
          className={`px-10 py-2  text-sm font-medium transition-colors duration-200 ${
            selectedRole === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-gray-500 hover:bg-gray-800'
          }`}
        >
          User
        </button>

        {/* Organizer Button */}
        <button
          onClick={() => handleRoleChange('organizer')}
          className={`px-6 py-2  text-sm font-medium transition-colors duration-200 ${
            selectedRole === 'organizer'
              ? 'bg-blue-600 text-white'
              : 'bg-transparent text-gray-500 hover:bg-gray-800'
          }`}
        >
          Organizer
        </button>
      </div>
    </div>
    </>
  )
}

export default ToggleButton
