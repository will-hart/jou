import * as React from 'react'
import { ICardDefinition } from '@jou/common/src/commonTypes'
import StaticPlayingCard from './StaticPlayingCard'

interface DraftCardProps {
  cards: ICardDefinition[]
  helpText?: React.ReactNode
  onSelect: (card: ICardDefinition) => void
}

const DraftCard = ({ cards, helpText, onSelect }: DraftCardProps) => {
  return (
    <div className="bg-gray-800 w-full h-screen overflow-hidden box-border flex flex-col justify-between items-center">
      <div> </div>
      <div> </div>
      {helpText || <h1 className="text-white">Click a card to draft it</h1>}
      <div className="flex flex-row justify-end items-between">
        {cards.map((card) => (
          <StaticPlayingCard
            card={card}
            width={120}
            onClick={onSelect}
            key={`draft_card_${card.id}`}
            style={{
              transform: 'translateY(50%)',
            }}
            hoverStyle={{
              transform: 'translateY(25%) translateZ(100px) scale(2.5)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default DraftCard
