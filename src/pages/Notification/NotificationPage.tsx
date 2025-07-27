import { useEffect, useState } from 'react';
import NotificationItem from '../../components/layout/NotificationItem/NotificationItem';
import PageLayout from '../../components/layout/OrganizerPageLayout/PageLayout';
import { useAppSelector } from '../../hooks/AuthHook';
import { deleteNotification, fetchNotification, markAsReadNotification } from '../../services/notificationService';
import { AlertCircle, AlertTriangle, BellOff, CheckCircle, Info } from 'lucide-react';


type NotificationType = 'success' | 'error' | 'warning' | 'info';
export interface INotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

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
const NotificationPage = () => {

  const userId = useAppSelector(state => state.authUser.user?.id)
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const notificationFN = async (id: string, label: string) => {

    if (label == 'markAsRead') {
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      try {
        await markAsReadNotification(id)
      } catch (error) {
        console.log(error)
      }
    } else if (label == 'delete') {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      try {
        await deleteNotification(id)
      } catch (error) {
        console.log(error)
      }
    }

  }
  useEffect(() => {
    const FetchNotification = async () => {
      const res = await fetchNotification(userId as string,page,limit)
      console.log(res)
      if (res.notifications) {
        setNotifications(res.notifications)
        setTotalPages(res.totalPages)
      }
    }
   if(userId) FetchNotification()
  }, [userId,page])



  return (
    <PageLayout>
      <div className='w-full max-w-4xl mx-auto bg-black/80 text-white min-h-auto'>
        <div className="px-4 py-4 bg-gray-900 ">
          <h1 className="text-white text-center text-xl" >Earlier</h1>
        </div>
        {notifications.length > 0 ? notifications.map(notification => {
          const { icon: Icon, iconColor, bgColor } = notificationTypes[notification.type]
          return (
            <NotificationItem key={notification._id} notificationFN={notificationFN} notification={notification} Icon={Icon} iconColor={iconColor} bgColor={bgColor} />

          )
        }) :
          <div className="flex flex-col items-center justify-center py-20 text-center text-white">
            <BellOff className="w-10 h-10 text-gray-500 mb-4" />
            <p className="text-xl font-semibold text-gray-300">No notifications available</p>
            <p className="text-sm text-gray-500 mt-2">
              You’re all caught up. We’ll let you know when something new arrives.
            </p>
          </div>
        }


        {totalPages > 10 && (
  <div className="flex justify-center items-center gap-4 py-4">
    <button
      className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
      disabled={page === 1}
      onClick={() => setPage((prev) => prev - 1)}
    >
      Previous
    </button>
    <span className="text-sm text-gray-400">
      Page {page} of {totalPages}
    </span>
    <button
      className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
      disabled={page === totalPages}
      onClick={() => setPage((prev) => prev + 1)}
    >
      Next
    </button>
  </div>
)}

      </div>
    </PageLayout>
  )
}

export default NotificationPage
