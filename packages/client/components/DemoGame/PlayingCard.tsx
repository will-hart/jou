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
    style,
    transformStyle,
  } = useDraggableLayout(location, containerBounds, () => {
    onClick && onClick(card)
  })

  const cardBackground = isDummy
    ? {}
    : { backgroundImage: `url(${card.imagePath})` }

  return (
    <animated.div style={style}>
      <animated.div
        className={`flex flex-col absolute justify-center items-center rounded-md bg-cover bg-no-repeat mx-1 ${
          isDummy ? '' : 'shadow-md'
        } ${isMoving ? 'z-50 select-none shadow-2xl' : ''}`}
        {...(animate ? gestureBindings() : {})}
        style={{
          ...cardBackground,
          ...style,
          transform: transformStyle(),
        }}
        onClick={!animate && onClick ? () => onClick(card) : undefined}
      >
        {' '}
      </animated.div>
    </animated.div>
  )
}

export default PlayingCard
