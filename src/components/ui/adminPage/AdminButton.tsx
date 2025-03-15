import React from 'react'
import { IAdminButton } from '../../../interfaces/Admin/Login/commonInterface';

const AdminButton:React.FC<IAdminButton>=({ type="button", text, onClick, icon, primary, secondary, outline, fullWidth }) => {
    const buttonClasses = `
      flex items-center justify-center py-3 px-6 rounded text-sm font-medium transition-colors duration-200
      ${primary ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
      ${secondary ? 'bg-white text-blue-600 hover:bg-gray-100' : ''}
      ${outline ? 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50' : ''}
      ${fullWidth ? 'w-full' : ''}
    `;
  
    return (
      <button
        type={type || 'button'}
        className={buttonClasses}
        onClick={onClick}
      >
        {icon && <span className="mr-2 flex items-center">{icon}</span>}
        {text}
      </button>
    );
  };

export default AdminButton
