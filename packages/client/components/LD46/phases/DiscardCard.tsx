import * as React from 'react'
import DraftCard from '../DraftCard'
import { ByTheSwordState } from '@jou/ld46'
import { BoardProps } from '../Board'

interface DiscardCardProps {
  state: ByTheSwordState
  playerId: string
  moveDone?: boolean
  moves: BoardProps['moves']
}

const DiscardCard = ({
  moves,
  playerId,
  moveDone,
  state,
}: DiscardCardProps) => {
  return (
    <DraftCard
      landscape
      cards={
        moveDone === true
          ? []
          : (state.players[playerId]?.handCardIds || []).map(
              (cId) => state.cards[cId]
            )
      }
      helpText={
        <div className="text-white">
          <h1>
            {moveDone ? (
              <span>Waiting for players...</span>
            ) : (
              <span>You may discard one card</span>
            )}
          </h1>
          <h2>
            Or{' '}
            <button
              onClick={() => moves.discardAndRedraw(null)}
              className="text-green-300"
            >
              click here
            </button>{' '}
            to redraw without discarding a card
          </h2>
        </div>
      }
      onSelect={
        moveDone
          ? undefined
          : (card) => {
              moves.discardAndRedraw(card.id)
            }
      }
    />
  )
}

export default DiscardCard
