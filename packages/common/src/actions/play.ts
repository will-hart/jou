import { Ctx } from 'boardgame.io'
import { IDefaultGameState } from '../commonTypes'

/**
 * Default check for whether the player can play the given card. By default checks
 * that the card is a real ID and in the player's hand
 *
 * @param G
 * @param ctx
 * @param cardId
 */
export const canPlayCard = (
  G: IDefaultGameState,
  ctx: Ctx,
  cardId: string
): boolean => {
  // check the card Id is given and the card exists
  if (!cardId || G.cards[cardId] === undefined) return false

  // check the card is in the player's hand
  const player = G.players[ctx.currentPlayer]
  if (!player.handCardIds.includes(cardId)) return false
  return true
}

/**
 * Plays the given card ID without applying any side effects
 */
export const playCard = (
  canPlayCardChecker?: (
    G: IDefaultGameState,
    ctx: Ctx,
    cardId: string
  ) => boolean,
  sideEffectHandler?: (
    G: IDefaultGameState,
    ctx: Ctx,
    cardId: string
  ) => boolean
) => (G: IDefaultGameState, ctx: Ctx, cardId: string): boolean => {
  if (canPlayCardChecker && !canPlayCardChecker(G, ctx, cardId)) return false

  // remove the card from the player
  const player = G.players[ctx.currentPlayer]
  player.handCardIds = player.handCardIds.filter((c) => c !== cardId)
  G.public[ctx.currentPlayer].handSize = player.handCardIds.length

  if (sideEffectHandler && !sideEffectHandler(G, ctx, cardId)) {
    // the side effect caused the card to be discarded
    G.secret.discardCardIds.push(cardId)
  } else {
    // add the card to the played cards list for this player
    G.public[ctx.currentPlayer].playedCards.push(cardId)
  }

  return true
}
