import React from 'react'
import { INotification } from '../../../pages/Notification/NotificationPage';
import { CircleCheckBig, Trash2 } from 'lucide-react';
interface INotificationItemProps {
  notification: INotification
  Icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  notificationFN:(id:string,label:string)=>void
}

const NotificationItem: React.FC<INotificationItemProps> = ({ notification, Icon, iconColor, bgColor,notificationFN }) => {
  const markAsRead = async(id: string) => {
      notificationFN(id,'markAsRead')
    };
    const handleDelete=async(id:string)=>{
      notificationFN(id,'delete')
    }

  console.log(notification)
  return (
    <div
  className={`flex items-start justify-between p-4 border-b border-gray-700 ${
    !notification.read ? bgColor : 'bg-blue-900/10'
  }`}
  
>
  {/* Left: Icon + Title + Message */}
  <div className="flex gap-4">
    <Icon className={`w-6 h-6 mt-1 ${iconColor}`} />
    <div>
      <h2 className="font-semibold">{notification.title}</h2>
      <p className="text-sm">{notification.message}</p>
    </div>
  </div>

  
  <div className="flex flex-col items-end justify-between gap-2 ml-4">
   
    <span className="text-xs text-gray-400 whitespace-nowrap">
      {new Date(notification.createdAt).toLocaleString()}
    </span>

  
    <div className="flex gap-2">
      {!notification.read && (
        <button
          className="p-1 rounded hover:bg-green-700/30"
          onClick={(e) => {
            e.stopPropagation();
            markAsRead(notification._id);
          }}
          title="Mark as Read"
        >
          <CircleCheckBig className="w-5 h-5 text-green-400" />
        </button>
      )}

      <button
        className="p-1 rounded hover:bg-red-700/30"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(notification._id);
        }}
        title="Delete Notification"
      >
        <Trash2 className="w-5 h-5 text-red-400" />
      </button>
    </div>
  </div>
</div>
  )
}

export default NotificationItem
