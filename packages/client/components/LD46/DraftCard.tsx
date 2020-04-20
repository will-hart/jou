import * as React from 'react'
import { ICardDefinition } from '@jou/common/src/commonTypes'
import StaticPlayingCard from './StaticPlayingCard'
import { CARD_ASPECT_RATIO } from '@jou/ld46'

interface DraftCardProps {
  landscape?: boolean
  cards: ICardDefinition[]
  helpText?: React.ReactNode
  onSelect: (card: ICardDefinition) => void
}

const DraftCard = ({
  cards,
  helpText,
  landscape,
  onSelect,
}: DraftCardProps) => {
  return (
    <div className="bg-gray-800 w-full h-screen overflow-hidden box-border flex flex-col justify-between items-center">
      <div> </div>
      <div> </div>
      {helpText || <h1 className="text-white">Click a card to draft it</h1>}
      <div className="flex flex-row justify-end items-between">
        {cards.map((card) => (
          <StaticPlayingCard
            card={card}
            width={landscape === true ? 120 * CARD_ASPECT_RATIO : 120}
            height={landscape === true ? 120 : 120 / CARD_ASPECT_RATIO}
            onClick={onSelect}
            key={`draft_card_${card.id}`}
            style={{
              transform: 'translateY(50%)',
            }}
            hoverStyle={{
              transform: 'translateY(0%) scale(2.5)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default DraftCard
