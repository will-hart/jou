import * as React from 'react'
import { useState } from 'react'
import { animated, useSpring, config, to as interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import { FullGestureState } from 'react-use-gesture/dist/types'

import { Transform, getTransformStyle } from '../../layout/Transform'
import { ICardDefinition } from '@jou/common'

interface PlayingCardProps {
  card: ICardDefinition
  transform: Transform
  dummy?: boolean
  onClick?: (card: ICardDefinition | null) => void
  cardText?: string
  textClassName?: string
  animate?: boolean
}

const PlayingCard = ({
  animate,
  card,
  cardText,
  dummy,
  onClick,
  textClassName,
  transform,
}: PlayingCardProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const [isDragDown, setIsDragDown] = useState<boolean>(false)

  const [{ tx }, setSpringProps] = useSpring(() => ({
    tx: transform.getTransformArray(),
    imediate: false,
    onRest: () => setIsDragging(false || isDragDown),
  }))
  const bindGesture = useGesture({
    onDrag: ({ down, elapsedTime, movement }: FullGestureState<'drag'>) => {
      transform.delta = down ? [...movement, 0.5] : [0, 0, 0]

      setIsDragDown(down)

      if (!down) {
        if (movement[1] < -150) {
          onClick && onClick(card)
        } else if (
          elapsedTime < 300 &&
          Math.abs(movement[0]) + Math.abs(movement[1]) < 20
        ) {
          onClick && onClick(card)
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSpringProps({
        tx: transform.getTransformArray(),
        immediate: down,
        config: config.stiff,
      })

      if (down) setIsDragging(true)
    },
  })

  // display a dummy placeholder card if required
  if (dummy)
    return (
      <animated.div
        className="hidden absolute"
        style={{ transform: getTransformStyle(transform.x, transform.y, 1, 0) }}
      />
    )

  const cardBackground = dummy
    ? {}
    : { backgroundImage: `url(${card.imagePath})` }

  return (
    <animated.div
      className={`flex flex-col absolute justify-center items-center shadow-md rounded-md bg-cover bg-no-repeat mx-1 ${
        isDragging ? 'z-50' : ''
      }`}
      {...(animate ? bindGesture() : {})}
      style={{
        ...cardBackground,
        ...transform.toBaseStyle(),
        transform: interpolate(
          tx,
          (x: number, y: number, scale: number, rotation: number) =>
            getTransformStyle(x, y, scale, rotation)
        ),
      }}
    >
      {cardText && (
        <span
          className={`text-4xl font-bold ${textClassName ? textClassName : ''}`}
        >
          {cardText}
        </span>
      )}
    </animated.div>
  )
}

export default PlayingCard
