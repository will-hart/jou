import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import useMeasure from 'react-use-measure'
import { Ctx } from 'boardgame.io'
import { MoveMap } from 'boardgame.io/dist/types/src/types'

import { IGameState, ICardDefinition } from '@jou/common'

import PlayerList from '../../game/PlayerList'
import TurnIndicator from '../../game/TurnIndicator'
import PlayingCard from './PlayingCard'

import {
  getTransformForSection,
  LayoutSection,
} from '../../layout/ExampleGameLayoutEngine'

import { getDummyCard, getRangeArray } from '../../utilities'

interface BoardProps {
  G: IGameState
  ctx: Ctx
  moves: {
    drawFullHand: () => void
    playCard: (cardId) => void
  }
}

const Board = ({ G: state, ctx: context, moves }: BoardProps) => {
  const [meId, setMeId] = useState<string>(null)
  const [opponentId, setOpponentId] = useState<string>(null)

  useEffect(() => {
    if (!state) return

    setMeId(Object.keys(state?.players)?.[0])
    setOpponentId(Object.keys(state?.public).filter((k) => k !== meId)?.[0])
  }, [setMeId, setOpponentId, state, meId, opponentId])

  const [ref, bounds] = useMeasure({
    debounce: 10,
    polyfill: ResizeObserver,
  })

  const getCards = useCallback(() => {
    if (
      !state ||
      !state.players ||
      !state.public ||
      !state.public[meId] ||
      !state.public[opponentId] ||
      !state.players[meId]
    )
      return

    const opponentPlayedCount =
      state.public[opponentId]?.playedCards.length || 0
    const myHandCount = state.players[meId]?.handCardIds.length || 0
    const myPlayedCount = state.public[meId]?.playedCards.length || 0

    let opPlay = 0
    let myHand = 0
    let myPlay = 0

    const getSection = (
      card: ICardDefinition
    ): { sec: LayoutSection; idx: number; totIdx: number } => {
      if (state.players[meId]?.handCardIds.includes(card.id)) {
        return {
          sec: LayoutSection.PLAYER_HAND,
          idx: myHand++,
          totIdx: myHandCount,
        }
      }
      if (state.public[meId].playedCards.includes(card.id))
        return {
          sec: LayoutSection.PLAYER_PLAY,
          idx: myPlay++,
          totIdx: myPlayedCount,
        }
      if (state.public[opponentId].playedCards.includes(card.id))
        return {
          sec: LayoutSection.OPPONENT_PLAY,
          idx: opPlay++,
          totIdx: opponentPlayedCount,
        }
      return { sec: LayoutSection.DRAW_PILE, idx: 0, totIdx: 0 }
    }

    return Object.values(state.cards).map((card) => {
      const { sec, idx, totIdx } = getSection(card)

      return (
        <PlayingCard
          key={card.id}
          transform={getTransformForSection(
            bounds.x,
            bounds.y,
            bounds.width,
            bounds.height,
            sec,
            totIdx,
            idx
          )}
          card={card}
          dummy={sec === LayoutSection.DRAW_PILE}
          animate={sec === LayoutSection.PLAYER_HAND}
          onClick={
            sec === LayoutSection.PLAYER_HAND
              ? () => moves.playCard(card.id)
              : undefined
          }
        />
      )
    })
  }, [meId, opponentId, state, bounds, moves])
  // can't useMemo here as it doesn't properly notify
  const opponentCards = getRangeArray(state.public[opponentId]?.handSize || 0)
  const opponentTransforms = opponentCards.map((idx) => ({
    card: null,
    tx: getTransformForSection(
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height,
      LayoutSection.OPPONENT_HAND,
      state.public[opponentId].handSize,
      idx
    ),
  }))

  return (
    <div ref={ref} className="flex-grow fixed top-0 left-0 w-full h-screen">
      <TurnIndicator isYourTurn={meId && context?.currentPlayer === meId} />
      <PlayerList players={state?.public} />

      {opponentTransforms.map(({ card, tx }, idx) => (
        <PlayingCard
          key={card?.id || `opp_hand_${idx}`}
          card={card || getDummyCard('opp_hand')}
          transform={tx}
        />
      ))}

      {getCards()}

      <PlayingCard
        key="draw_pile"
        transform={getTransformForSection(
          bounds.left,
          bounds.top,
          bounds.width,
          bounds.height,
          LayoutSection.DRAW_PILE,
          1,
          1
        )}
        card={getDummyCard('draw_back', '/cards/back.png')}
      />
    </div>
  )
}

export default Board
