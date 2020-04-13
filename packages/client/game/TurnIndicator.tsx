import * as React from 'react'

interface TurnIndicatorProps {
  isYourTurn: boolean
}

const TurnIndicator = ({ isYourTurn }: TurnIndicatorProps) => {
  return (
    <div
      className={`fixed top-0 right-0 z-50 ${
        isYourTurn ? 'bg-green-700' : 'bg-gray-700'
      } opacity-75 select-none p-2 text-md font-bold text-gray-100`}
    >
      {isYourTurn ? 'Your Turn' : "Opponent's Turn"}
    </div>
  )
}

export default TurnIndicator
