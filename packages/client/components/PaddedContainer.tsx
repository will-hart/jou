import * as React from 'react'
import { ChildWithClassNameProps } from './standardProps'

const PaddedContainer = ({ children, className }: ChildWithClassNameProps) => (
  <div
    className={`p-4 md:shadow-md w-full bg-gray-200 flex flex-col ${className}`}
  >
    {children}
  </div>
)

export default PaddedContainer
