import * as React from 'react'
import DraftCard from '../DraftCard'
import { ByTheSwordState, CARD_ASPECT_RATIO } from '@jou/ld46'
import { BoardProps } from '../Board'
import StaticPlayingCard from '../StaticPlayingCard'

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
          <h3 className="mb-3">Existing creatures</h3>
          <div className="flex flex-row mb-12">
            {state.currentCreatures
              .map((id) => state.creatureDeck[id])
              .map((card) => {
                return (
                  <StaticPlayingCard
                    key={card.id}
                    card={card}
                    width={140}
                    height={100}
                  />
                )
              })}
          </div>
          <h1 className="text-center">
            {isMyTurn ? (
              <>
                <span>Select a Creature to fight</span>
              </>
            ) : (
              <span>Waiting for players...</span>
            )}
          </h1>
          {isMyTurn && (
            <>
              <h2>{state.arenaScore} available to spend</h2>
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
              moves.draftCreature(card.id)
            }
          : undefined
      }
    />
  )
}

export default DraftCreatures
