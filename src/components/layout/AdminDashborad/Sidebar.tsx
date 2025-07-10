
import { 
    LayoutDashboard, 
    Calendar, 
    Ticket, 
    Users, 
    Tag, 
    MessageSquare, 
    Bell, 
    CreditCard, 
    User, 
    LogOut, 
    UserRoundCog,
    Group
  } from 'lucide-react';
  import { Link} from 'react-router-dom';

const Sidebar = () => {

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true ,link:'/admin-dashboard'},
        { icon: <Calendar size={20} />, label: 'Events',link:'/admin-events' },
        // { icon: <Ticket size={20} />, label: 'Ticketing' },
        { icon: <Users size={20} />, label: 'Users' ,link:'/admin-user'},
        { icon:<UserRoundCog size={20} /> ,label:'Organizers',link:'/admin-organizer'},
        { icon: <Tag size={20} />, label: 'Tags',link:'/admin-tags' },
        { icon: <Group size={20} />, label: 'Categories',link:'/admin-category' },
        // { icon: <MessageSquare size={20} />, label: 'Messages' },
        // { icon: <Bell size={20} />, label: 'Notifications' },
        { icon: <CreditCard size={20} />, label: 'Payment and Transactions' },
        { icon: <User size={20} />, label: 'Profile' },
        { icon: <LogOut size={20} />, label: 'Logout' },
        
      ];
  return (
    <div className="bg-white w-64 border-r border-gray-200 hidden md:flex md:flex-col">
    <div className="p-4 border-b">
      <h1 className="text-blue-600 text-2xl font-bold">NestEve</h1>
    </div>
    
    <nav className="flex-1 overflow-y-auto">
      <ul className="p-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link 
              to={item.link as string}
              className={`flex items-center px-4 py-3 text-gray-600 rounded-md mb-1 ${
                location.pathname===item.link ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
              }`}
              
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </div>
  )
}

export default Sidebar
