import React from 'react'
import { cn } from './utils'

const Card = ({ children, className }) => {
  return (
    <div className={cn('p-4 rounded-xl md:rounded-2xl bg-[#333]', className)}>
      { children }
    </div>
  )
}

export default Card