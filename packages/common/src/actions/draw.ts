import { Ctx } from 'boardgame.io'
import { IGameState } from '../commonTypes'
import {
  shuffleDiscardIntoDraw,
  shufflePersonalDiscardIntoPersonalDraw,
} from './shuffle'

/**
 * Draws a card from a deck.
 *
 * @param G
 * @param playerId
 */
const _drawCardToPlayerHand = (
  G: IGameState,
  playerId: string,
  usePrivate = false
) => {
  const drawDeck = usePrivate
    ? G.players[playerId].personalDraw
    : G.secret.drawCardIds
  const discardDeck = usePrivate
    ? G.players[playerId].personalDiscard
    : G.secret.discardCardIds

  if (drawDeck.length === 0) {
    if (discardDeck.length > 0) {
      usePrivate
        ? shufflePersonalDiscardIntoPersonalDraw(G, null, playerId)
        : shuffleDiscardIntoDraw(G)
    } else {
      console.log(' --> No cards available')
      return
    }
  }

  const cardId = drawDeck.pop()
  G.players[playerId].handCardIds.push(cardId)
  G.public[playerId].handSize++
}

export const drawCard = (G: IGameState, ctx: Ctx) => {
  const playerId = ctx.currentPlayer
  _drawCardToPlayerHand(G, playerId, false)
}

export const drawCardFromPersonalDeck = (G: IGameState, ctx: Ctx) => {
  if (!G.secret.rules.usePersonalDeck) return
  const playerId = ctx.currentPlayer
  _drawCardToPlayerHand(G, playerId, true)
}

export const drawToFullHand = (G: IGameState, ctx: Ctx) => {
  while (
    G.public[ctx.currentPlayer].handSize <
    G.players[ctx.currentPlayer].maxHandSize
  ) {
    drawCard(G, ctx)
  }
}

export const drawToFullHandFromPersonalDeck = (G: IGameState, ctx: Ctx) => {
  if (!G.secret.rules.usePersonalDeck) return
  while (
    G.public[ctx.currentPlayer].handSize <
    G.players[ctx.currentPlayer].maxHandSize
  ) {
    drawCardFromPersonalDeck(G, ctx)
  }
}

export const drawCardToAvailableCards = (G: IGameState) => {
  if (!G.availableCards) return
  if (G.availableCards.length >= G.secret.rules.availableCardSize) return

  if (G.secret.drawCardIds.length === 0) {
    if (G.secret.discardCardIds.length > 0) {
      shuffleDiscardIntoDraw(G)
    } else {
      console.log(' --> No cards available')
      return
    }
  }

  const cardId = G.secret.drawCardIds.pop()
  G.availableCards.push(cardId)
}

const _claimAvailableCard = (
  G: IGameState,
  playerId: string,
  cardId: string
) => {
  if (!G.availableCards.includes(cardId)) {
    console.log(` --> available cards does not include ${cardId}`)
    return null
  }

  G.availableCards = G.availableCards.filter((c) => c !== cardId)
  return cardId
}

export const claimAvailableCardToPersonalDiscard = (
  G: IGameState,
  ctx: Ctx,
  cardId: string
) => {
  if (!G.secret.rules.usePersonalDeck) {
    console.log('Personal deck not enabled')
    return
  }

  const claimedCardId = _claimAvailableCard(G, ctx.currentPlayer, cardId)
  if (!claimedCardId) return

  G.players[ctx.currentPlayer].personalDiscard.push(claimedCardId)
}

export const claimAvailableCardToPersonalDraw = (
  G: IGameState,
  ctx: Ctx,
  cardId: string
) => {
  if (!G.secret.rules.usePersonalDeck) {
    console.log('Personal deck not enabled')
    return
  }

  const claimedCardId = _claimAvailableCard(G, ctx.currentPlayer, cardId)
  if (!claimedCardId) return

  G.players[ctx.currentPlayer].personalDraw.push(claimedCardId)
}
