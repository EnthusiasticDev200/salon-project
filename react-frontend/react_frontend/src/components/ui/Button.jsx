import React from 'react'
import { cn } from './utils'

const Button = ({ children, className, clickHandler = () => {} }) => {
  return (
    <button className={cn('py-2 px-6 bg-accent text-black rounded hover:bg-accentDark transition-all', className)} onClick={clickHandler}>
      { children }
    </button>
  )
}

export default Button