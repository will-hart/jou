import * as React from 'react'
import { useState, useEffect } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import useMeasure from 'react-use-measure'
import { Ctx } from 'boardgame.io'

import { ByTheSwordState } from '@jou/ld46'
import DraftFighters from './phases/DraftFighters'
import DraftCreatures from './phases/DraftCreatures'

export interface BoardProps {
  G: ByTheSwordState
  ctx: Ctx
  gameMetadata: { players: { [key: string]: { id: number; name: string } } }
  moves: {
    draftFighter: (fighterId: string) => void
    draftCreature: (creatureId?: string) => void
    discardAndRedraw: (cardId?: string) => void
    pass: () => void
    playCardWithTarget: (
      cardId: string,
      targetId?: string,
      targetIsCreature?: boolean
    ) => string
  }
}

const getBoardContext = (
  state: ByTheSwordState,
  ctx: Ctx,
  meId: string,
  moves: BoardProps['moves']
) => {
  const phase = ctx.phase
  const isMyTurn = ctx.currentPlayer === meId

  switch (phase) {
    case 'initialFighterDraft':
    case 'fighterDraft':
      return (
        <DraftFighters
          isMyTurn={isMyTurn}
          moves={moves}
          phase={phase}
          state={state}
        />
      )

    case 'draftCreatures':
      return <DraftCreatures isMyTurn={isMyTurn} moves={moves} state={state} />
    default:
      return <p>Unknown phase</p>
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
      {getBoardContext(state, context, meId, moves)}
    </div>
  )
}

export default Board
