import * as React from 'react'
import DraftCard from '../DraftCard'
import { ByTheSwordState } from '@jou/ld46'
import { BoardProps } from '../Board'

interface DraftCreaturesProps {
  state: ByTheSwordState
  isMyTurn: boolean
  moves: BoardProps['moves']
}

const DraftCreatures = ({ moves, isMyTurn, state }: DraftCreaturesProps) => {
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
}

export default DraftCreatures
