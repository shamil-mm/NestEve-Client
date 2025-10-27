import React from "react";


const CategoryCard:React.FC<{title:string,image:string}> = ({ title, image }) => {
  return (
    <div className="relative overflow-hidden rounded-lg group h-48 sm:h-56 md:h-64">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white px-4 text-center">{title}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;