import * as React from 'react'
import DraftCard from '../DraftCard'
import { ByTheSwordState } from '@jou/ld46'
import { BoardProps } from '../Board'

interface DiscardCardProps {
  state: ByTheSwordState
  playerId: string
  isMyTurn: boolean
  moveDone?: boolean
  moves: BoardProps['moves']
}

const DiscardCard = ({
  moves,
  playerId,
  isMyTurn,
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
            {moveDone || !isMyTurn ? (
              <span>Waiting for players...</span>
            ) : (
              <span>
                You may discard one card, or{' '}
                <button onClick={() => moves.pass()} className="text-green-300">
                  click here to skip
                </button>{' '}
              </span>
            )}
          </h1>
          <h2>Your hand will draw back up to 5 cards</h2>
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
