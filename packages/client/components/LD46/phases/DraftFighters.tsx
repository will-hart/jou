import * as React from 'react'
import DraftCard from '../DraftCard'
import { ByTheSwordState } from '@jou/ld46'
import { BoardProps } from '../Board'

interface DraftFightersProps {
  state: ByTheSwordState
  phase: string
  isMyTurn: boolean
  moves: BoardProps['moves']
}

const DraftFighters = ({
  moves,
  isMyTurn,
  state,
  phase,
}: DraftFightersProps) => {
  return (
    <DraftCard
      cards={state.availableCharacters.map((cId) => state.characterDeck[cId])}
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
}

export default DraftFighters
