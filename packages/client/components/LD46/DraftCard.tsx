import * as React from 'react'
import { ICardDefinition } from '@jou/common/src/commonTypes'
import StaticPlayingCard from './StaticPlayingCard'
import { CARD_ASPECT_RATIO } from '@jou/ld46'

interface DraftCardProps {
  landscape?: boolean
  cards: ICardDefinition[]
  helpText?: React.ReactNode
  onSelect: (card: ICardDefinition) => void
  sinkCards?: boolean
}

const DraftCard = ({
  cards,
  helpText,
  landscape,
  onSelect,
  sinkCards,
}: DraftCardProps) => {
  const width = landscape === true ? 120 * CARD_ASPECT_RATIO : 120
  const height =
    landscape === true ? width / CARD_ASPECT_RATIO : width * CARD_ASPECT_RATIO

  return (
    <div className="bg-gray-800 w-full h-screen overflow-hidden box-border flex flex-col justify-between items-center">
      <div> </div>
      <div> </div>
      {helpText || <h1 className="text-white">Click a card to draft it</h1>}
      <div className="flex flex-row justify-end items-between">
        {cards.map((card) => (
          <StaticPlayingCard
            card={card}
            width={width}
            height={height}
            onClick={onSelect}
            key={`draft_card_${card.id}`}
            style={{
              transform: sinkCards ? 'translateY(50%)' : '',
            }}
            hoverStyle={{
              transform: 'translateY(-100%) scale(2.5)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default DraftCard
