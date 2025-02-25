import React from "react";


const CategoryCard:React.FC<{title:string,image:string}> = ({ title, image }) => {
  return (
    <div className="relative overflow-hidden rounded-lg group h-64">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;