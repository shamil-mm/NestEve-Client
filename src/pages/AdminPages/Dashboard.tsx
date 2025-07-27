import { BookOpen, Calendar, DollarSign, Users } from "lucide-react";
import AdminCommonLayout from "../../components/common/Admin/AdminCommonLayout";
import StatCard from "../../components/layout/AdminDashborad/StatCard";
import SalesChart from "../../components/layout/AdminDashborad/SalesChart";
import PieChartCard from "../../components/layout/AdminDashborad/PieChartCard";
import DailyTrafficCard from "../../components/layout/AdminDashborad/DailyBookingCard";
import { useEffect, useState } from "react";
import { getAdminDashboardData } from "../../services/apiService";
import {
  IAdminDashboardResponse, IMonthlyRevenue, IDailyBooking, IEventsByCategory,
  IPieChartItem,IDashboardStats
} from "../../interfaces/IAdmindashBoard";


const Dashboard = () => {
   const [stats, setStats] = useState<IDashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<IMonthlyRevenue[]>([]);
  const [eventsByCategory, setEventsByCategory] = useState<IEventsByCategory>({});
  const [dailyBookings, setDailyBookings] = useState<IDailyBooking[]>([]);


  useEffect(() => {
    async function GetDashBoardData() {
      try {
        const data:IAdminDashboardResponse = await getAdminDashboardData()
       setStats({
          totalUsers: data.totalUsers,
          totalEvents: data.totalEvents,
          totalBookings: data.totalBookings,
          totalRevenue: data.totalRevenue,
        });
        setMonthlyRevenue(data.monthlyRevenue);
        setEventsByCategory(data.eventsByCategory);
        setDailyBookings(data.dailyBookings);
      } catch (error) {
        console.error("Failed to fetch admin dashboard data:", error);
    
      } 
    }
    GetDashBoardData()

  }, [])
  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: <Users className="text-white" size={24} />,
      iconBg: "bg-blue-500",
    },
    {
      title: "Total Events",
      value: stats.totalEvents.toString(),
      icon: <Calendar className="text-white" size={24} />,
      iconBg: "bg-blue-500",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toString(),
      icon: <BookOpen className="text-white" size={24} />,
      iconBg: "bg-blue-500",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="text-white" size={24} />,
      iconBg: "bg-blue-500",
    },
  ];
const salesData: { month: number; value: number }[] = Array.isArray(monthlyRevenue)
  ? monthlyRevenue.map((item) => ({
      month: item.month ?? 0,
      value: item.amount ?? 0,
    }))
  : [];

   const pieChartData: IPieChartItem[] = Object.entries(eventsByCategory).map(
    ([name, value], index) => ({
      name,
      value,
      color: ["#4661ee", "#63c5da", "#e0e0e0", "#f28b82", "#a7ffeb"][index % 5],
    })
  );


  const dayNameMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const trafficData = [
  { day: 'Mon', value: 0 },
  { day: 'Tue', value: 0 },
  { day: 'Wed', value: 0 },
  { day: 'Thu', value: 0 },
  { day: 'Fri', value: 0 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 },
];


dailyBookings.forEach(item => {
  const dayName = dayNameMap[item.day as number - 1]; 
  const target = trafficData.find(d => d.day === dayName);
  if (target) {
    target.value = item.count;
  }
});



  return (
    <AdminCommonLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            iconBg={card.iconBg}
          />
        ))}
      </div>

      <div className="bg-blue-600 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Sales Details</h2>
          {/* <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded">
            October <span className="ml-1">▼</span>
          </div> */}
        </div>
        <SalesChart data={salesData} />
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PieChartCard data={pieChartData} />
        <DailyTrafficCard data={trafficData} />
      </div>

    </AdminCommonLayout>

  )
}

export default Dashboard
