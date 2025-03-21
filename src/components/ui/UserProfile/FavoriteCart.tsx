import React from 'react';

type FavoriteItem={
    name:string;
    image:string;
}

const FavoriteCart:React.FC<{favorites:FavoriteItem[]}> = ({favorites}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-row space-x-7 overflow-x-auto scrollbar-hide">
        {favorites.map((item, index) => (
          <div
            key={index}
            className="bg-black rounded-lg overflow-hidden w-72 flex-shrink-0"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2">
              <p className="text-sm text-white">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoriteCart
