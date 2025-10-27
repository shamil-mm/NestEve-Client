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
    <header className="bg-white border-b border-black-200 py-2 sm:py-3 px-3 sm:px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-2 sm:gap-3 md:gap-4">
          {admin&&(<div className="flex items-center">
            <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
              <span className="text-xs font-medium">{admin.email?.[0]?.toUpperCase()}</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xs sm:text-sm font-medium truncate max-w-[120px] md:max-w-none">{admin.email}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>)}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <Bell size={18} className="sm:w-5 sm:h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </div>

          <div onClick={handleLogout} className="flex items-center cursor-pointer p-1 sm:p-2 hover:bg-gray-100 rounded">
          <LogOut size={18} className="sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
