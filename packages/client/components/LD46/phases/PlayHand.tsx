import * as React from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import {
  ByTheSwordState,
  CARD_ASPECT_RATIO,
  resolveSingleCombat,
} from '@jou/ld46'
import useMeasure from 'react-use-measure'
import { BoardProps } from '../Board'
import StaticPlayingCard from '../StaticPlayingCard'
import { useCallback, useState, useEffect } from 'react'
import { ICardDefinition } from '@jou/common'
import { CardPlayingState, getNextState } from './playHandHelpers'
import CombatPowerIcon from '../icons/CombatPowerIcon'
import CardHandIcon from '../icons/CardHandIcon'

interface PlayHandProps {
  state: ByTheSwordState
  isMyTurn: boolean
  meId: string
  moves: BoardProps['moves']
}

const PlayHand = ({ isMyTurn, meId, moves, state }: PlayHandProps) => {
  // measure the board so we can scale the layout to fit
  const [ref, bounds] = useMeasure({
    debounce: 10,
    polyfill: ResizeObserver,
  })

  const [selectedCard, setSelectedCard] = useState<ICardDefinition | null>(null)
  const [targetId, setTargetId] = useState<string | null>(null)
  const [cardPlayingState, setCardPlayingState] = useState<CardPlayingState>(
    CardPlayingState.SelectingCard
  )

  // listen for the card being ready to submit and submit it
  useEffect(() => {
    // nothing to do
    if (cardPlayingState !== CardPlayingState.Apply) return

    // apply the card
    moves.playCardWithTarget(selectedCard.id, targetId)

    // reset
    setCardPlayingState(CardPlayingState.SelectingCard)
    setTargetId(null)
    setSelectedCard(null)
  }, [
    moves,
    cardPlayingState,
    setCardPlayingState,
    setTargetId,
    selectedCard,
    setSelectedCard,
    targetId,
  ])

  // called when the player clicks a card from their hand
  const handleCardClick = useCallback(
    (card: ICardDefinition) => {
      if (selectedCard && !card.id.startsWith('action')) return

      if (selectedCard && selectedCard.id === card.id) {
        setSelectedCard(null)
        return
      }

      const nextState = getNextState(card, targetId)
      setCardPlayingState(nextState)
      setSelectedCard(card)
    },
    [setCardPlayingState, selectedCard, setSelectedCard, targetId]
  )

  // when a target is clicked
  const onClickTarget = useCallback(
    (card: ICardDefinition) => {
      if (
        !selectedCard ||
        cardPlayingState !== CardPlayingState.SelectingTarget
      )
        return

      const nextState = getNextState(selectedCard, card.id)
      setTargetId(card.id)
      setCardPlayingState(nextState)
    },
    [selectedCard, cardPlayingState, setTargetId, setCardPlayingState]
  )

  const getHelpMessage = (): string => {
    if (!isMyTurn) return 'Waiting for other players...'
    if (!selectedCard) return 'Select a card to play'
    if (!targetId) return 'Select a target'
    return 'Uh oh?'
  }

  return (
    <div className="fixed top-0 left-0 w-full h-screen select-none text-white">
      <div className="fixed top-0 w-1/5 h-screen">
        <div className="mt-12 pl-3 border-box" id="other-player-container">
          {Object.keys(state.public)
            .filter((k) => k !== meId)
            .map((pId) => (
              <div key={`player_target_${pId}`}>
                <div
                  className={`border border-gray-200 px-2 py-4 text-center ${
                    cardPlayingState === CardPlayingState.SelectingTarget
                      ? 'bg-red-600 hover:bg-red-500 cursor-pointer'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Player {pId}
                </div>
                {cardPlayingState === CardPlayingState.SelectingTarget &&
                  state.public[pId].fighters
                    .map((f) => state.characterDeck[f])
                    .map((card, idx) => (
                      <div
                        className="block mx-auto mt-3 cursor-pointer"
                        key={`player_target_${pId}_card_${idx}`}
                      >
                        <StaticPlayingCard
                          card={card}
                          width={100}
                          height={100 * CARD_ASPECT_RATIO}
                          onClick={
                            cardPlayingState ===
                            CardPlayingState.SelectingTarget
                              ? () => onClickTarget(card)
                              : undefined
                          }
                        />
                      </div>
                    ))}
              </div>
            ))}
        </div>
      </div>

      <div className="fixed top-0 p-2" style={{ left: '20%', height: '40%' }}>
        {state.currentCreatures
          .map((id) => state.creatureDeck[id])
          .map((card) => {
            const combat = resolveSingleCombat(state, card.id)
            return (
              <div key={`creature_card_${card.id}`}>
                <div className="mt-2">
                  <CardHandIcon />{' '}
                  <span className="mr-3">
                    {
                      state.targetedCards.filter(
                        (t) => t.targetedAtId === card.id
                      ).length
                    }
                  </span>
                  <CombatPowerIcon />
                  <span
                    className={
                      combat.attackSucceeded ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {combat?.attackersCP} / {combat?.defenderCP}
                  </span>
                </div>

                <StaticPlayingCard
                  card={card}
                  width={(CARD_ASPECT_RATIO * bounds.width) / 4.5}
                  height={bounds.width / 4.5}
                  style={
                    cardPlayingState === CardPlayingState.SelectingTarget
                      ? { cursor: 'pointer' }
                      : {}
                  }
                  hoverStyle={{
                    ...(cardPlayingState === CardPlayingState.SelectingTarget
                      ? { cursor: 'pointer' }
                      : {}),
                    transform: `translatey(100%) scale(2)`,
                  }}
                  onClick={
                    cardPlayingState === CardPlayingState.SelectingTarget
                      ? () => onClickTarget(card)
                      : undefined
                  }
                />
              </div>
            )
          })}
      </div>
      <h3
        className="fixed"
        style={{ top: '50%', left: '50%', textAlign: 'center' }}
      >
        {getHelpMessage()}
      </h3>
      <div
        ref={ref}
        className="flex flex-row items-end fixed "
        style={{
          top: '60%',
          left: '20%',
          minWidth: '60%',
          width: '60%',
          height: '40%',
        }}
      >
        {(state.players[meId]?.handCardIds || [])
          .map((c) => state.cards[c])
          .map((card) => {
            return (
              <StaticPlayingCard
                selected={card.id === selectedCard?.id}
                key={`player_card_${card.id}`}
                card={card}
                width={bounds.width / 6.5}
                height={(CARD_ASPECT_RATIO * bounds.width) / 6.5}
                style={{
                  cursor: 'pointer',
                  transform: 'translateY(50%)',
                }}
                hoverStyle={{
                  cursor: 'pointer',
                  transform: `translateY(-50%) scale(${
                    300 / (bounds.width / 5.5)
                  })`,
                }}
                onClick={isMyTurn ? () => handleCardClick(card) : undefined}
              />
            )
          })}

        <button
          className="ml-4 bg-gray-600 hover:bg-gray-400 px-3 py-2 mb-1"
          onClick={() => moves.pass()}
        >
          Pass
        </button>
      </div>

      <div
        className="fixed top-0 opacity-50"
        style={{ left: '80%', width: '20%' }}
      >
        <h2>Scores</h2>
        <p>Party: {state.arenaScore}</p>
        {Object.values(state.public).map((pub) => (
          <p key={`score_player_${pub.id}`}>
            Player {pub.id}: {pub.score}
          </p>
        ))}
      </div>
    </div>
  )
}

export default PlayHand
