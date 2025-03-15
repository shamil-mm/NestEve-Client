import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
interface IPieChartCard{
    data:{
        name: string;
        value: number;
        color: string;
    }[]
}
const PieChartCard:React.FC<IPieChartCard> = ({data}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold mb-4">Pie Chart</h3>
    
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            formatter={(value) => (
              <span className="text-gray-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
    
    <div className="flex justify-around mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: item.color }}
          ></div>
          <div>
            <div className="text-xs text-gray-500">{item.name}</div>
            <div className="text-sm font-semibold">{item.value}%</div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default PieChartCard
