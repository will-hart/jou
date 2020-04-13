import { Ctx } from 'boardgame.io'
import { IGameState } from '../commonTypes'
import { shuffleDiscardIntoDraw } from './shuffle'

export const drawCard = (G: IGameState, ctx: Ctx) => {
  const playerId = ctx.currentPlayer

  if (G.secret.drawCardIds.length === 0) {
    if (G.secret.discardCardIds.length > 0) {
      shuffleDiscardIntoDraw(G)
    } else {
      return
    }
  }

  const cardId = G.secret.drawCardIds.pop()
  G.players[playerId].handCardIds.push(cardId)
  G.public[playerId].handSize++
}

export const drawToFullHand = (G: IGameState, ctx: Ctx) => {
  while (
    G.public[ctx.currentPlayer].handSize <
    G.players[ctx.currentPlayer].maxHandSize
  ) {
    drawCard(G, ctx)
  }
}
