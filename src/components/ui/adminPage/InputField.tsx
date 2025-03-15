import React from 'react'

import { InputFieldProps } from '../../../interfaces/Admin/Login/commonInterface'

const InputField:React.FC<InputFieldProps> = ({label,type,value,onChange,placeholder,required}) => {
  return (
    <div className="flex flex-col mb-2 w-full">
      <label className="text-xs font-bold mb-2 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="p-3 border border-gray-300 rounded text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default InputField
