import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import {
  Calendar,
  Ticket,
  DollarSign,
  Users,
} from "lucide-react";
import { useAppSelector } from "../../../hooks/AuthHook";

import { getDashboardData } from "../../../services/apiService";

ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

export interface IEventDashboardSummary {
  _id: string;
  title: string;
  startDate: string;     
  endDate: string;       
  totalBookings: number;
  totalRevenue: number;
  refunds: number;
}
export interface IRecentBooking {
  _id: string;
  createdAt: string;
  eventId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    name: string;
  };
  tickets: {
    price: number;
    quantity: number;
    [key: string]: any; 
  }[];
}

interface IChartPeriodData {
  labels: string[];
  bookings: number[];
  revenue: number[];
}

interface IChartData {
  yearly: IChartPeriodData;
  monthly: IChartPeriodData;
  weekly: IChartPeriodData;
}

const StatCard = ({ icon: Icon, title, value, color }: any) => (
  <div className={`rounded-lg p-4 shadow-md text-white ${color}`}>
    <div className="flex items-center space-x-4">
      <Icon className="w-6 h-6" />
      <div>
        <div className="text-sm">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
    </div>
  </div>
);



const OrganizerDashboard = () => {
  const [view, setView] = useState<"yearly" | "monthly" | "weekly">("weekly");
  const userId = useAppSelector((state) => state.authUser?.user?.id)
  const [stats,setStats]=useState({
    totalEvents: 0,
    totalBookings: 0,
    totalAttendees: 0,
    totalRevenue: 0,
  })
  const [events,setEvents]=useState<IEventDashboardSummary[]|[]>([])
  const [bookings,setBookings]=useState<IRecentBooking[]|[]>([])
  const [chartData, setChartData] = useState<IChartData>({
  yearly: { labels: [], bookings: [], revenue: [] },
  monthly: { labels: [], bookings: [], revenue: [] },
  weekly: { labels: [], bookings: [], revenue: [] },
});

  useEffect(()=>{
    async function GetDashboardData(){
    const res=  await getDashboardData(userId as string)
    setStats((prev)=>({...prev,totalEvents:res?.data.totalEvents}))
    setStats(prev => ({...prev,
                        totalAttendees: res?.data.bookingStats.totalAttendees,
                        totalBookings: res?.data.bookingStats.totalBookings,
                        totalRevenue: res?.data.bookingStats.totalRevenue
                      }));
    setEvents(res?.data.eventStats)
    setBookings(res?.data?.bookingStats?.recentBooking)
    setChartData(res?.data?.bookingStats?.chartData)
    }
    GetDashboardData()
  },[])

  const selected = chartData[view];

  const lineChartData = {
    labels: selected.labels,
    datasets: [
      {
        label: "Bookings",
        data: selected.bookings,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true,
        yAxisID: "y",
      },
      {
        label: "Revenue (₹)",
        data: selected.revenue,
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139,92,246,0.2)",
        tension: 0.4,
        fill: true,
        yAxisID: "y1",
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#fff" },
        title: { display: true, text: "Bookings", color: "#fff" },
      },
      y1: {
        beginAtZero: true,
        position: "right" as const,
        ticks: { color: "#fff" },
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Revenue", color: "#fff" },
      },
      x: { ticks: { color: "#fff" } },
    },
  };

  const pieData = {
    labels: events?.map((e) => e.title) || [],
    datasets: [
      {
        label: "Booking Share",
        data: events?.map((e) => e.totalBookings) || [],
         backgroundColor: [
        "rgba(59, 130, 246, 0.2)",  
        "rgba(16, 185, 129, 0.2)", 
        "rgba(245, 158, 11, 0.2)",  
        "rgba(139, 92, 246, 0.2)", 
        "rgba(239, 68, 68, 0.2)",
      ],
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio:false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { color: "#fff" },
      },
    },
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-black/60 text-white p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Event Organizer Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <StatCard icon={Calendar} title="Total Events" value={stats.totalEvents} color="bg-blue-600/20" />
        <StatCard icon={Ticket} title="Total Bookings" value={stats.totalBookings} color="bg-green-600/20" />
        <StatCard icon={Users} title="Total Attendees" value={stats.totalAttendees} color="bg-yellow-500/20" />
        <StatCard icon={DollarSign} title="Revenue" value={`₹${stats.totalRevenue}`} color="bg-purple-600/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-3 bg-white/10 backdrop-blur rounded-xl p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bookings & Revenue Trends</h2>
            <select
              value={view}
              onChange={(e) => setView(e.target.value as any)}
              className="bg-white/10 text-white border border-white/20 rounded px-3 py-1 text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

        <div className="col-span-1 bg-white/10 backdrop-blur rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Booking Distribution</h2>
          <div className="w-full flex justify-center">
        <div className="w-60 h-64"> 
          {Array.isArray(events) && events.length >0 && (
            <Pie data={pieData} options={pieOptions} />
          )}
        </div>
      </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Latest Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-300 border-b border-white/20">
              <tr>
                <th className="py-2">Title</th>
                <th>Date</th>
                <th>Bookings</th>
                <th>Revenue</th>
                <th>Refund</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(event) && events.length >0 && (events.map((e) => (
                <tr key={e._id} className="border-b border-white/10">
                  <td className="py-2">{e.title}</td>
                  <td>{formatDate(e.startDate)}</td>
                  <td>{e.totalBookings}</td>
                  <td>₹{e.totalRevenue}</td>
                  <td> {e.refunds}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        <ul className="divide-y divide-white/20 text-sm">
          {bookings.map((b) => (
            <li key={b._id} className="flex justify-between py-3">
              <div>
                <span className="font-medium">{b.userId.name}</span> has successfully booked <strong>{b.tickets.length}</strong> ticket(s) for the  {b.eventId.title}
              </div>
              <div className="text-gray-300">{formatDate(b.createdAt)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
