
import { IStatCard } from '../../../interfaces/Admin/Login/commonInterface'
import clsx from 'clsx'

const StatCard:React.FC<IStatCard> = ({ title, value, icon, iconBg ,className}) => {
   

   
  return (
    <div className={clsx("bg-blue-600 rounded-lg p-6 text-white",className)}>
    <div className="flex items-center mb-4">
      <div className={`${iconBg || 'bg-blue-500'} p-2 rounded-md mr-2`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
  )
}

export default StatCard
