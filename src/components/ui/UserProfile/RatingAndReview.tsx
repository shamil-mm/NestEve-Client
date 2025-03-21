import { Star } from "lucide-react"

const RatingAndReview = () => {
  return (
    <div>
    <h2 className="text-lg font-semibold mb-4">Rating and Reviews</h2>
    
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-center border-b border-gray-800 py-3">
        <div className="w-8 h-8 bg-gray-700 rounded-full mr-3 overflow-hidden">
          <img 
            src="/api/placeholder/40/40" 
            alt="User avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm">Nice transactions!!</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex mb-1">
            <Star size={16} fill="#FFD700" stroke="none" className="mr-1" />
            <Star size={16} fill="#FFD700" stroke="none" className="mr-1" />
            <Star size={16} fill="#FFD700" stroke="none" />
          </div>
          <span className="text-xs text-gray-400">2 days</span>
        </div>
      </div>
    ))}
  </div>
  )
}

export default RatingAndReview
