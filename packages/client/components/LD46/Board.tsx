import * as React from 'react'
import { useState, useEffect } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import useMeasure from 'react-use-measure'
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
  // keep me/opponent Ids in state
  const [meId, setMeId] = useState<string>(null)

  // effect that updates my id / opponent id on changes
  useEffect(() => {
    if (!state) return

    setMeId(Object.keys(state?.players)?.[0])
  }, [setMeId, state, meId])

  // measure the board so we can scale the layout to fit
  const [ref, bounds] = useMeasure({
    debounce: 10,
    polyfill: ResizeObserver,
  })

  return (
    <div
      ref={ref}
      className="flex-grow fixed top-0 left-0 w-full h-screen select-none"
    >
      {meId} - {JSON.stringify(bounds)}
    </div>
  )
}

export default Board
