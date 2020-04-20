import * as React from 'react'
import { ICardDefinition } from '@jou/common'
import { CARD_ASPECT_RATIO } from '@jou/ld46'
import { useState } from 'react'

interface ICardTransform {
  x: number
  y: number
  scale: number
  rotation: number
}

interface StaticPlayingCardProps {
  card: ICardDefinition
  transform?: ICardTransform
  width: number
  height: number
  selected?: boolean
  style?: React.CSSProperties
  hoverStyle?: React.CSSProperties
  onClick?: (card: ICardDefinition | null) => void
}

const StaticPlayingCard = ({
  card,
  onClick,
  width,
  height,
  hoverStyle,
  selected,
  style,
}: StaticPlayingCardProps) => {
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)

  const cardBackground = { backgroundImage: `url(${card.imagePath})` }
  const size = { width, height }

  const useStyle = isHovering && hoverStyle ? hoverStyle : style

  return (
    <div
      className={`block box-border rounded-md mx-1 bg-cover bg-no-repeat transition-all duration-300${
        isAnimating && isHovering ? ' z-50' : isAnimating ? ' z-40' : ''
      }${selected ? ' border-4 border-red-500' : ''}`}
      onMouseEnter={
        hoverStyle
          ? () => {
              setIsAnimating(true)
              setIsHovering(true)
            }
          : undefined
      }
      onMouseLeave={
        hoverStyle
          ? () => {
              setIsHovering(false)
              setTimeout(() => setIsAnimating(false), 350)
            }
          : undefined
      }
      style={{
        ...cardBackground,
        ...size,
        ...useStyle,
      }}
      onClick={onClick ? () => onClick(card) : undefined}
    >
      {' '}
    </div>
  )
}

export default StaticPlayingCard
