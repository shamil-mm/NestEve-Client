import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

interface IDailyBookingCard {
  data: {
    day: string;
    value: number;
  }[]
}

const DailyBookingCard: React.FC<IDailyBookingCard> = ({ data }) => {
  const totalThisWeek = data.reduce((sum, item) => sum + item.value, 0);
  const prevWeekTotal = totalThisWeek * 0.8; // Dummy previous week value
  const percentChange = ((totalThisWeek - prevWeekTotal) / prevWeekTotal) * 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Daily Bookings</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-2">
              {(totalThisWeek / data.length).toFixed(2)}
            </span>
            <span className="text-sm text-gray-500">avg. bookings/day</span>
          </div>
        </div>
        <div className={`text-sm ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange).toFixed(1)}%
        </div>
      </div>

      <div className="h-75">
       <ResponsiveContainer width="100%" height="100%">
  <BarChart data={data}>
    <XAxis
      dataKey="day"
      axisLine={{ stroke: '#e5e7eb' }}
      tickLine={false}
      tick={{ fontSize: 15 }}
    />
    <YAxis hide />
    <Tooltip
      formatter={(value) => [`${value} bookings`, 'Bookings']}
      cursor={{ fill: 'rgba(224, 231, 255, 0.2)' }}
    />
    <CartesianGrid
      vertical={false} 
      stroke="#f3f4f6" 
      strokeDasharray="3 3"
    />
    <Bar
      dataKey="value"
      fill="#38bdf8"
      radius={[4, 4, 0, 0]}
      barSize={20}
    />
  </BarChart>
</ResponsiveContainer>

      </div>
    </div>
  );
};

export default DailyBookingCard;
