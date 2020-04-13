import * as React from 'react'

const SharedLayout = ({ children }: SharedLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-500 overflow-hidden">
      {children}
    </div>
  )
}

export interface SharedLayoutProps {
  children: React.ReactNode
}

export default SharedLayout
