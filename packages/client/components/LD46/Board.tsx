import * as React from 'react'
// import { useState, useEffect, useCallback } from 'react'
// import { ResizeObserver } from '@juggle/resize-observer'
// import useMeasure, { RectReadOnly } from 'react-use-measure'
import { Ctx } from 'boardgame.io'

import { IGameState } from '@jou/common'
// import { LayoutSection, getCardLocationData } from '@jou/demo'

// import PlayerList from '../../game/PlayerList'
// import TurnIndicator from '../../game/TurnIndicator'
// import PlayingCard from './PlayingCard'
// import { getRangeArray, getDummyCard } from '../../utilities'
// import { DEMO_BASE_CARD_PATH } from '../../constants'

interface BoardProps {
  G: IGameState
  ctx: Ctx
  moves: {
    drawToFullHand: () => void
    playCard: (cardId) => void
  }
}

const Board = ({ G: state, ctx: context, moves }: BoardProps) => {
  return <div>Not complete</div>
}

export default Board
