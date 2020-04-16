import { IGameState } from '@jou/common/src/commonTypes'

import { LayoutSection } from './'

export interface ICardLocationData {
  sec: LayoutSection
  idx: number
  totIdx: number
}

/**
 * Gets the location of a card for the given player and card ID, also
 * returning useful information for rendering the card amongst groups of
 * cards, i.e. in a player's hand
 *
 * @param G
 * @param playerId
 * @param cardId
 */
export const getCardLocationData = (
  G: IGameState,
  playerId: string,
  cardId: string
): ICardLocationData => {
  // if the card doesn't exist, assume its in the draw pile
  if (!G.cards[cardId] || !G.players[playerId])
    return { sec: LayoutSection.DRAW_PILE, idx: 0, totIdx: 0 }

  // if the card is in the users hand, render it there
  const handIdx = G.players[playerId]?.handCardIds.findIndex(
    (c) => c === cardId
  )
  if (handIdx !== -1) {
    return {
      sec: LayoutSection.PLAYER_HAND,
      idx: handIdx,
      totIdx: G.players[playerId]?.handCardIds.length || 0,
    }
  }

  // if the card is one of the played cards, show it in the right spot
  const playerIds = Object.keys(G.public)
  for (const pId of playerIds) {
    const idx = G.public[pId].playedCards.findIndex((c) => c === cardId)
    if (idx === -1) continue

    return {
      sec:
        pId === playerId
          ? LayoutSection.PLAYER_PLAY
          : LayoutSection.OPPONENT_PLAY,
      idx,
      totIdx: G.public[pId].playedCards.length,
    }
  }

  // if the card isn't found elsewhere, assume it is in the draw pile
  return { sec: LayoutSection.DRAW_PILE, idx: 0, totIdx: 0 }
}
