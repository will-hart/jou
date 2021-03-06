import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { ResizeObserver } from '@juggle/resize-observer'
import useMeasure, { RectReadOnly } from 'react-use-measure'
import { Ctx } from 'boardgame.io'

import { IGameState } from '@jou/common'
import { LayoutSection, getCardLocationData } from '@jou/demo'

import PlayerList from '../../game/PlayerList'
import TurnIndicator from '../../game/TurnIndicator'
import PlayingCard from './PlayingCard'
import { getRangeArray, getDummyCard } from '../../utilities'
import { DEMO_BASE_CARD_PATH } from '../../constants'

const getPlayerCards = (
  state: IGameState,
  bounds: RectReadOnly,
  meId: string,
  isMyTurn: boolean,
  playCard: (id: string) => void
) =>
  Object.values(state.cards).map((card) => {
    const loc = getCardLocationData(state, meId, card.id)
    const isDummy = loc.sec === LayoutSection.DRAW_PILE
    const onClick =
      !isDummy && loc.sec === LayoutSection.PLAYER_HAND && isMyTurn
        ? () => playCard(card.id) // can play from hand
        : undefined // otherwise do nothing

    return (
      <PlayingCard
        key={card.id}
        card={card}
        location={loc}
        containerBounds={bounds}
        isDummy={isDummy}
        onClick={onClick}
        animate={loc.sec === LayoutSection.PLAYER_HAND}
      />
    )
  })

interface BoardProps {
  G: IGameState
  ctx: Ctx
  moves: {
    drawToFullHand: () => void
    playCard: (cardId) => void
  }
}

const Board = ({ G: state, ctx: context, moves }: BoardProps) => {
  // keep me/opponent Ids in state
  const [meId, setMeId] = useState<string>(null)
  const [opponentId, setOpponentId] = useState<string>(null)

  // effect that updates my id / opponent id on changes
  useEffect(() => {
    if (!state) return

    setMeId(Object.keys(state?.players)?.[0])
    setOpponentId(Object.keys(state?.public).filter((k) => k !== meId)?.[0])
  }, [setMeId, setOpponentId, state, meId, opponentId])

  // measure the board so we can scale the layout to fit
  const [ref, bounds] = useMeasure({
    debounce: 10,
    polyfill: ResizeObserver,
  })

  // memoize the card generatror function
  const cardGenerator = useCallback(() => {
    return getPlayerCards(
      state,
      bounds,
      meId,
      meId === context.currentPlayer,
      moves.playCard
    )
  }, [state, bounds, meId, moves, context])

  const opponentCards = getRangeArray(state.public[opponentId]?.handSize || 0)

  // render all the cards all the time. makes it easier to animate when they are discarded etc.
  return (
    <div
      ref={ref}
      className="flex-grow fixed top-0 left-0 w-full h-screen select-none"
    >
      {cardGenerator()}
      {opponentCards.map((id) => (
        <PlayingCard
          key={`opponent_hand_card_${id}`}
          card={getDummyCard(
            `opponent_hand_${id}`,
            `${DEMO_BASE_CARD_PATH}/back.png`
          )}
          containerBounds={bounds}
          location={{
            sec: LayoutSection.OPPONENT_HAND,
            idx: id,
            totIdx: opponentCards.length,
          }}
        />
      ))}
      <PlayingCard
        key="card_draw_pile"
        card={getDummyCard('draw_pile', `${DEMO_BASE_CARD_PATH}/back.png`)}
        containerBounds={bounds}
        location={{ sec: LayoutSection.DRAW_PILE, idx: 0, totIdx: 0 }}
        onClick={moves.drawToFullHand}
      />
      <PlayerList players={state.public} />
      <TurnIndicator isYourTurn={context.currentPlayer === meId} />
    </div>
  )
}

export default Board
