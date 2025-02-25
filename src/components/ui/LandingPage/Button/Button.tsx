import React, { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  variant?:'primary' | 'outline'
  children:ReactNode
}

const Button :React.FC<ButtonProps>= ({variant='Primary',children,...props}) => {
  const variants:Record<'primary' | 'outline',string> = {
    primary: 'bg-blue-700 hover:bg-blue-700',
    outline: 'border-2 border-blue-700 hover:bg-#2f00ff text-white',
  };
  return (
    <button
    className={`
      px-6 py-2 rounded-md font-medium transition-all
      ${variants[variant as keyof typeof variants]}
    `}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
