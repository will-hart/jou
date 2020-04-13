import { Transform } from './Transform'

export enum LayoutSection {
  DRAW_PILE,
  OPPONENT_HAND,
  OPPONENT_PLAY,
  PLAYER_HAND,
  PLAYER_PLAY,
}

const CARD_HEIGHT_RATIO = 4 / 3

export const getCardHeightFromWidth = (width: number) =>
  width * CARD_HEIGHT_RATIO
export const getCardWidthFromHeight = (height: number) =>
  height / CARD_HEIGHT_RATIO

// Use this to memoize some calculations
const boardConfiguration = {
  xOffset: 0,
  yOffset: 0,
  fromWidth: -1,
  fromHeight: -1,
  cardWidth: 0,
  cardHeight: 0,

  drawPileX: 0,

  handCentreX: 0,

  yCoords: {
    [LayoutSection.DRAW_PILE]: 0,
    [LayoutSection.OPPONENT_HAND]: 0,
    [LayoutSection.OPPONENT_PLAY]: 0,
    [LayoutSection.PLAYER_HAND]: 0,
    [LayoutSection.PLAYER_PLAY]: 0,
  },

  cardSpacing: 10, // pixels between cards
  boardSpacing: 50, // pixels between board segments
}

/**
 * A simple layout engine. I'm doing this instead of flex box or other because it allows easier animation
 * between piles / drag drop / hover effects etc using react-spring as I can just update the "target" transform
 *
 * @param containerXOffset
 * @param containerYOffset
 * @param width
 * @param height
 */
const recalculateLayout = (
  containerXOffset: number,
  containerYOffset: number,
  width: number,
  height: number
) => {
  // don't recalculate if not necessary
  if (
    width === boardConfiguration.fromWidth &&
    height === boardConfiguration.fromHeight &&
    containerXOffset === boardConfiguration.xOffset &&
    containerYOffset === boardConfiguration.yOffset
  )
    return

  // store this width / height combination
  boardConfiguration.fromWidth = width
  boardConfiguration.fromHeight = height
  boardConfiguration.xOffset = containerYOffset
  boardConfiguration.yOffset = containerXOffset

  // get the card size - height is based on fitting the card to the width and the height
  // variable spacing will appear between the hand and discard pile if required horizontally,
  // or between the rows of cards if required vertically
  boardConfiguration.cardWidth = Math.min(
    getCardWidthFromHeight((height - 3 * boardConfiguration.cardSpacing) / 4), // constrained by height
    (width - 3 * 50 - 4 * boardConfiguration.cardSpacing) / 6
  )
  boardConfiguration.cardHeight = getCardHeightFromWidth(
    boardConfiguration.cardWidth
  )

  // discard pile 2/3 card width + 1 card width in from the edge, and 1/2 card above the half height
  boardConfiguration.drawPileX =
    boardConfiguration.xOffset +
    width -
    boardConfiguration.cardWidth -
    boardConfiguration.boardSpacing
  boardConfiguration.yCoords[LayoutSection.DRAW_PILE] =
    0.5 * height - 0.5 * boardConfiguration.cardHeight

  boardConfiguration.handCentreX =
    boardConfiguration.xOffset +
    boardConfiguration.boardSpacing +
    0.5 *
      (5 * boardConfiguration.cardWidth + 4 * boardConfiguration.cardSpacing)

  boardConfiguration.yCoords[LayoutSection.OPPONENT_HAND] =
    boardConfiguration.yOffset - 0.5 * boardConfiguration.cardHeight // on the container top

  boardConfiguration.yCoords[LayoutSection.OPPONENT_PLAY] =
    boardConfiguration.yOffset +
    0.375 * height -
    0.5 * boardConfiguration.cardHeight

  boardConfiguration.yCoords[LayoutSection.PLAYER_PLAY] =
    boardConfiguration.yOffset +
    0.625 * height -
    0.5 * boardConfiguration.cardHeight

  boardConfiguration.yCoords[LayoutSection.PLAYER_HAND] =
    boardConfiguration.yOffset + height - 0.5 * boardConfiguration.cardHeight
}

const getXOffsetForIndex = (count: number, index: number) => {
  const halfCount = count / 2

  return (
    boardConfiguration.handCentreX -
    (index - halfCount) * boardConfiguration.cardWidth -
    Math.floor(index - halfCount - 1) * boardConfiguration.cardSpacing
  )
}

/**
 * Calculates the width, height and x/y position and rotation of a card based on the segment and screen size
 *
 * @param containerWidth The width in pixels of the parent container
 * @param containerHeight The height in pixels of the parent container
 * @param section The section that this card belongs to
 * @param index The index of the card within the segment (0-based)
 */
export const getTransformForSection = (
  xOffset: number,
  yOffset: number,
  containerWidth: number,
  containerHeight: number,
  section: LayoutSection,
  sectionCount: number,
  index: number
): Transform => {
  // recalculate the card layout if required (memoized)
  recalculateLayout(xOffset, yOffset, containerWidth, containerHeight)

  const tfm = new Transform(
    boardConfiguration.cardWidth,
    boardConfiguration.cardHeight
  )

  // set x/y positions
  if (section === LayoutSection.DRAW_PILE) {
    tfm.x = boardConfiguration.drawPileX
    tfm.y = boardConfiguration.yCoords[LayoutSection.DRAW_PILE]
  } else {
    // default for most cases
    tfm.x = boardConfiguration.xOffset + getXOffsetForIndex(sectionCount, index)
    tfm.y = boardConfiguration.yCoords[section]
  }

  // rotate / offset hands
  if (section === LayoutSection.OPPONENT_HAND) {
    tfm.rotation = 180
  }

  return tfm
}
