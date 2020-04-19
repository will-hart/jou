import * as React from 'react'
// import { useState, useEffect, useCallback } from 'react'
// import { ResizeObserver } from '@juggle/resize-observer'
// import useMeasure, { RectReadOnly } from 'react-use-measure'
import { Ctx } from 'boardgame.io'

import { ByTheSwordState } from '@jou/ld46'
// import { LayoutSection, getCardLocationData } from '@jou/demo'

// import PlayerList from '../../game/PlayerList'
// import TurnIndicator from '../../game/TurnIndicator'
// import PlayingCard from './PlayingCard'
// import { getRangeArray, getDummyCard } from '../../utilities'
// import { DEMO_BASE_CARD_PATH } from '../../constants'

interface BoardProps {
  G: ByTheSwordState
  ctx: Ctx
  moves: {
    draftFighter: (G: ByTheSwordState, ctx: Ctx, fighterId: string) => void
    draftCreature: (G: ByTheSwordState, ctx: Ctx, creatureId?: string) => void
    discardAndRedraw: (G: ByTheSwordState, ctx: Ctx, cardId?: string) => void
    pass: (G: ByTheSwordState, ctx: Ctx) => void
    playCardWithTarget: (
      G: ByTheSwordState,
      ctx: Ctx,
      cardId: string,
      targetId?: string,
      targetIsCreature?: boolean
    ) => string
  }
}

const Board = ({ G: state, ctx: context, moves }: BoardProps) => {
  return <div>Not complete</div>
}

export default Board
