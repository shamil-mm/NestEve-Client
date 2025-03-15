import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip } from 'recharts';

interface ISalesChart {
  data: { month: number; value: number }[];
}

const SalesChart: React.FC<ISalesChart> = ({ data }) => {
  const maxPoint = data.reduce((max, point) => (point.value > max.value ? point : max), data[0]);
  const maxIndex = data.findIndex(point => point.month === maxPoint.month); // Fix for positioning

  return (
    <div className="w-full h-64 text-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#FFFFFF', fontSize: 10 }} 
          />
          <YAxis 
            tick={{ fill: '#FFFFFF', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Sales']}
            labelFormatter={(value) => `Month ${value}`}
            contentStyle={{ backgroundColor: '#1E40AF', borderColor: '#1E3A8A' }}
          />
          <CartesianGrid stroke="#5168E6" strokeDasharray="3 3" vertical={false} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#FFFFFF" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, stroke: '#FFFFFF', strokeWidth: 2, fill: '#3B82F6' }}
          />

          {/* Value Label for Highest Point */}
          <text
            x={`${(maxIndex / (data.length - 1)) * 100}%`} // Corrected position
            y="30%"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize={12}
            fontWeight="bold"
          >
            ${maxPoint.value.toLocaleString()}
          </text>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;

