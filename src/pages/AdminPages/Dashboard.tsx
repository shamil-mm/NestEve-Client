import { BookOpen, Calendar, DollarSign, Users } from "lucide-react";
import AdminCommonLayout from "../../components/common/Admin/AdminCommonLayout";
import StatCard from "../../components/layout/AdminDashborad/StatCard";
import SalesChart from "../../components/layout/AdminDashborad/SalesChart";
import PieChartCard from "../../components/layout/AdminDashborad/PieChartCard";
import DailyTrafficCard from "../../components/layout/AdminDashborad/DailyTrafficCard";
const Dashboard = () => {
    const statCards = [
        { 
          title: 'Total Users', 
          value: '10000', 
          icon: <Users className="text-white" size={24} />,
          iconBg: 'bg-blue-500'
        },
        { 
          title: 'Total Events', 
          value: '1500', 
          icon: <Calendar className="text-white" size={24} />,
          iconBg: 'bg-blue-500'
        },
        { 
          title: 'Total Bookings', 
          value: '5000', 
          icon: <BookOpen className="text-white" size={24} />,
          iconBg: 'bg-blue-500'
        },
        { 
          title: 'Revenue', 
          value: '500000', 
          icon: <DollarSign className="text-white" size={24} />,
          iconBg: 'bg-blue-500'
        }
      ];

      const salesData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        value: Math.floor(Math.random() * 100000) + 20000
      }));

      const pieChartData = [
        { name: 'Premium', value: 63, color: '#4661ee' },
        { name: 'Regular', value: 25, color: '#63c5da' },
        { name: 'Other', value: 12, color: '#e0e0e0' }
      ];


      const trafficData = [
        { day: 'Mon', value: 320 },
        { day: 'Tue', value: 280 },
        { day: 'Wed', value: 420 },
        { day: 'Thu', value: 300 },
        { day: 'Fri', value: 380 },
        { day: 'Sat', value: 400 },
        { day: 'Sun', value: 250 }
      ];


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
            <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded">
              October <span className="ml-1">▼</span>
            </div>
          </div>
          <SalesChart data={salesData} />
        </div>
        
        {/* Bottom Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PieChartCard data={pieChartData} />
          <DailyTrafficCard data={trafficData} />
        </div>
        
      </AdminCommonLayout>
    
  )
}

export default Dashboard
