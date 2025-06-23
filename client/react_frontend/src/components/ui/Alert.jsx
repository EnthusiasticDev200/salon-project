import React from 'react'
import { cn } from './utils'

const Alert = ({ children, className = '', type = 'error' || 'success' }) => {
  return (
    <div className={cn(`w-full py-4 px-8 text-center uppercase border-2 rounded-xl ${type == 'error' ? 'border-red-300 bg-red-100 text-red-700' : 'border-green-600 bg-green-100 text-green-700'}`, className)}>
      { children }
    </div>
  )
}

export default Alert