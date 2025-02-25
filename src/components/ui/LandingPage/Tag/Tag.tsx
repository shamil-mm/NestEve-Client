import React, { ReactNode } from 'react';
interface TagProps{
    children:ReactNode;
}

const Tag:React.FC<TagProps> = ({ children }) => {
  return (
    <span className="inline-block bg-nBlue text-nBlue text-xs px-3 py-1 rounded-full">
      {children}
    </span>
  );
};

export default Tag;