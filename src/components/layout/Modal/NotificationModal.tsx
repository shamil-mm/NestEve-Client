import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../../hooks/AuthHook';
import { deleteNotification, fetchNotification, markAsReadNotification } from '../../../services/notificationService';



type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface INotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const NotificationModal = () => {
  const userId=useAppSelector(state=>state.authUser.user?.id)
    const [notifications, setNotifications] = useState<INotification[]>([]);
   useEffect(()=>{
     const FetchNotification=async()=>{
      const res=  await fetchNotification(userId as string,1,6)
      if(res.notifications){
        console.log(res.notifications)
        setNotifications(res.notifications)
      }
    }
    FetchNotification()
   },[])



   const notificationTypes: Record<
    NotificationType,
    {
      icon: React.ElementType;
      iconColor: string;
      bgColor: string;
    }
  > = {
    success: {
      icon: CheckCircle,
      iconColor: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
    error: {
      icon: AlertCircle,
      iconColor: 'text-red-400',
      bgColor: 'bg-red-900/20',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
    },
  };

  const panelRef = useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = async(id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    try {
      await markAsReadNotification(id)
    } catch (error) {
      console.log(error)
    }
  };

  const removeNotification = async(id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await deleteNotification(id)
    } catch (error) {
      console.log(error)
    }
  };

 

  return (
    <div className="relative top-17 left-60 ">
      <div
        ref={panelRef}
        className="absolute right-0 mt-2 w-96 bg-black border  rounded-sm shadow-2xl z-50 overflow-hidden"
      >
        <div className="p-4 border-b border-gray-700 ">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>

       
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto mb-4 text-gray-600" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {notifications.map((notification) => {
                const { icon: IconComponent, iconColor, bgColor } = notificationTypes[notification.type];
                return (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-800/50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-900/10' : ''
                    }`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="flex items-start space-x-3">
                      
                      <div className={`flex-shrink-0 p-2 rounded-full ${bgColor}`}>
                        <IconComponent size={16} className={iconColor} />
                      </div>
                      

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4
                              className={`text-sm font-medium ${
                                !notification.read ? 'text-white' : 'text-green-800'
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                          <span className='text-white'>{notification.time}</span>  
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"/>}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification._id);
                              }}
                              className="p-1 text-gray-500 hover:text-gray-300 transition-colors rounded"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-700 bg-gray-900/50">
            <button className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors text-center">
               All Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
