import * as React from 'react'
import { ChildWithClassNameProps } from './standardProps'

const Card = ({ children, className }: ChildWithClassNameProps) => (
  <div
    className={`p-6 md:p-4 md:shadow-lg bg-gray-100 flex flex-col md:m-6 box-border ${
      className || ''
    }`}
  >
    {children}
  </div>
)

export default Card
