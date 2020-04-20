import * as React from 'react'
import DraftCard from '../DraftCard'
import { ByTheSwordState } from '@jou/ld46'
import { BoardProps } from '../Board'

interface DraftFightersProps {
  state: ByTheSwordState
  phase: string
  meId: string
  isMyTurn: boolean
  moves: BoardProps['moves']
}

const DraftFighters = ({
  moves,
  isMyTurn,
  meId,
  state,
  phase,
}: DraftFightersProps) => {
  return (
    <DraftCard
      cards={state.availableCharacters.map((cId) => state.characterDeck[cId])}
      helpText={
        <div className="text-white">
          <h1 className="text-center">
            {isMyTurn ? (
              <>
                <img
                  alt="Character Cards"
                  width={150}
                  height={210}
                  className="mx-auto"
                  src="https://bythesword-cards.s3-ap-southeast-2.amazonaws.com/fighter_back.png"
                />
                <span>
                  Select a {phase.startsWith('initial') ? 'starting' : ''}{' '}
                  Gladiator
                </span>
              </>
            ) : (
              <span>Waiting for players...</span>
            )}
          </h1>
          {!phase.startsWith('initial') && isMyTurn && (
            <>
              <h2>
                You have {state.public[meId]?.score || 0} popularity to spend
              </h2>
              <h3>
                Or{' '}
                <button onClick={() => moves.pass()} className="text-green-300">
                  click here
                </button>{' '}
                to pass
              </h3>
            </>
          )}
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
