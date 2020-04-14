import { IGameState } from '../commonTypes'
import { shuffleArray } from '../utilities'
import { Ctx } from 'boardgame.io'

export const shuffleDiscardIntoDraw = (G: IGameState) => {
  G.secret.drawCardIds = shuffleArray([
    ...G.secret.drawCardIds,
    ...G.secret.discardCardIds,
  ])
  G.secret.discardCardIds = []
}

export const shufflePersonalDiscardIntoPersonalDraw = (
  G: IGameState,
  ctx: Ctx,
  playerId: string
) => {
  G.players[playerId].personalDraw = shuffleArray([
    ...G.players[playerId].personalDraw,
    ...G.players[playerId].personalDiscard,
  ])

  G.players[playerId].personalDiscard = []
}

export const moveAvailableIntoDiscard = (G: IGameState) => {
  G.secret.discardCardIds = [...G.secret.discardCardIds, ...G.availableCards]
  G.availableCards = []
}

/**
 * Returns all the shuffled cards into the global discard pile
 *
 * @param G The game state
 */
export const moveAllPlayedToDiscard = (G: IGameState) => {
  Object.values(G.public).forEach((pub) => {
    G.secret.discardCardIds = [...G.secret.discardCardIds, ...pub.playedCards]
    pub.playedCards = []
  })
}

/**
 * Moves all the played cards from the given palyer into personal discard piles.
 *
 * Server only
 *
 * @param G
 */
export const movePlayerPlayedToPersonalDiscardServerOnly = (
  G: IGameState,
  playerId: string
) => {
  G.players[playerId].personalDiscard = [
    ...G.players[playerId].personalDiscard,
    ...G.public[playerId].playedCards,
  ]

  G.public[playerId].playedCards = []
}

/**
 * Moves the current player's played cards to their personal discard pile
 *
 * @param G
 * @param ctx
 */
export const movePlayedtoPersonalDiscard = (G: IGameState, ctx: Ctx) => {
  movePlayerPlayedToPersonalDiscardServerOnly(G, ctx.currentPlayer)
}
