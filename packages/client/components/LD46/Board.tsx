import * as React from 'react'
import { useState, useEffect } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import useMeasure from 'react-use-measure'
import { Ctx } from 'boardgame.io'

import { ByTheSwordState } from '@jou/ld46'
import DraftCard from './DraftCard'

interface BoardProps {
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
        <DraftCard
          cards={state.availableCharacters.map(
            (cId) => state.characterDeck[cId]
          )}
          helpText={
            <div className="text-white">
              <h1>
                {isMyTurn ? (
                  <span>
                    Select a {phase.startsWith('initial') ? 'starting' : ''}{' '}
                    Gladiator
                  </span>
                ) : (
                  <span>Waiting for players...</span>
                )}
              </h1>
              {!phase.startsWith('initial') && <h2>Or click here to pass</h2>}
            </div>
          }
          onSelect={
            isMyTurn
              ? (card) => {
                  moves.draftFighter(card.id)
                }
              : undefined
          }
        />
      )

    case 'draftCreatures':
      return (
        <DraftCard
          landscape
          cards={state.availableCreatures.map((cId) => state.creatureDeck[cId])}
          helpText={
            <div className="text-white">
              <h1>
                {isMyTurn ? (
                  <span>Select a Creature to fight</span>
                ) : (
                  <span>Waiting for players...</span>
                )}
              </h1>
              <h2>
                Or{' '}
                <button onClick={() => moves.pass()} className="text-green-300">
                  click here
                </button>{' '}
                to pass
              </h2>
            </div>
          }
          onSelect={
            isMyTurn
              ? (card) => {
                  moves.draftCreature(card.id)
                }
              : undefined
          }
        />
      )
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
