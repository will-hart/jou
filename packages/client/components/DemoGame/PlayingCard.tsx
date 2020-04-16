import * as React from 'react'
import { animated } from 'react-spring'

import { ICardBounds, ICardLocationData } from '@jou/demo'
import { ICardDefinition } from '@jou/common'
import useDraggableLayout from '../../hooks/useDraggableLayout'

interface PlayingCardProps {
  containerBounds: ICardBounds
  card: ICardDefinition
  location: ICardLocationData
  isDummy?: boolean
  onClick?: (card: ICardDefinition | null) => void
  animate?: boolean
}

const PlayingCard = ({
  animate,
  card,
  containerBounds,
  location,
  isDummy,
  onClick,
}: PlayingCardProps) => {
  const {
    gestureBindings,
    isMoving,
    readyToDraw,
    style,
    transformStyle,
  } = useDraggableLayout(location, containerBounds, card.id, () => {
    onClick && onClick(card)
  })

  const cardBackground = isDummy
    ? {}
    : { backgroundImage: `url(${card.imagePath})` }

  return readyToDraw ? (
    <animated.div
      className={`fixed block rounded-md mx-1 bg-cover bg-no-repeat${
        isDummy ? '' : ' shadow-md'
      }${isMoving ? ' z-50 select-none shadow-2xl' : ''}`}
      {...(animate ? gestureBindings() : {})}
      style={{
        ...style,
        ...cardBackground,
        transform: transformStyle(),
      }}
      onClick={!animate && onClick ? () => onClick(card) : undefined}
    >
      {' '}
    </animated.div>
  ) : null
}

export default PlayingCard
