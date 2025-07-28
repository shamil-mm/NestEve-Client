import { Bell, LogOut } from 'lucide-react';
import { useAppDispatch,useAppSelector } from '../../../hooks/AuthHook';
import React from 'react';
// import { logoutSuccess } from '../../../store/slices/authUsers';
import { setLogoutAdmin } from '../../../store/slices/authAdmin';
import { adminLogout} from '../../../services/authServices';
import { toast } from 'react-fox-toast';
import { useNavigate } from 'react-router-dom';




const Header = () => {
  const dispatch=useAppDispatch()
  const {admin}=useAppSelector((state)=>state.authAdmin)
  const navigate=useNavigate()

  const handleLogout=async(e:React.MouseEvent<HTMLDivElement>)=>{
    e.preventDefault()
    dispatch(setLogoutAdmin())
       const res=await adminLogout()
      //  console.log(res!.data!.success)
       toast.success(res!.data!.success)
       localStorage.removeItem('authAdminState');
       navigate('/admin-login')

  }

  return (
    <header className="bg-white border-b border-black-200 py-2 px-4">
      <div className="flex items-center justify-between">
        <div className="md:hidden">
          <h1 className="text-blue-600 text-xl font-bold">NestEve</h1>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            {/* <input
              type="text"
              placeholder="Search"
              className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div> */}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>
          {admin&&(<div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
              <span className="text-xs font-medium">MR</span>
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium">{admin.email}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>)}
          
          

          <div onClick={handleLogout} className="flex items-center m-3 cursor-pointer">
          <LogOut />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
