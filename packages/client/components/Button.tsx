import * as React from 'react'
import { ChildWithClassNameProps } from './standardProps'

interface ButtonProps extends ChildWithClassNameProps {
  onClick: () => void
  colour?: string
}

const Button = ({ children, className, colour, onClick }: ButtonProps) => {
  const col = colour || 'blue'
  return (
    <button
      onClick={onClick}
      className={`m-2 px-6 py-3 bg-${col}-500 text-white hover:bg-${col}-400 ${
        className || ''
      }`}
    >
      {children}
    </button>
  )
}

export default Button
