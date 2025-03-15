import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface IDailyTrafficCard {
  data: {
    day: string;
    value: number;
  }[]
}
const DailyTrafficCard: React.FC<IDailyTrafficCard> = ({ data }) => {
  const totalThisWeek = data.reduce((sum, item) => sum + item.value, 0);
  const prevWeekTotal = totalThisWeek * 0.8;
  const percentChange = ((totalThisWeek - prevWeekTotal) / prevWeekTotal) * 100;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">Daily Traffic</h3>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold mr-2">
              {(totalThisWeek / data.length).toFixed(3)}
            </span>
            <span className="text-sm text-gray-500">attendees</span>
          </div>
        </div>
        <div className={`text-sm ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange).toFixed(1)}%
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis hide={true} />
            <Tooltip
              formatter={(value) => [`${value} attendees`, 'Traffic']}
              cursor={{ fill: 'rgba(224, 231, 255, 0.2)' }}
            />
            <Bar
              dataKey="value"
              fill="#4661ee"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailyTrafficCard
