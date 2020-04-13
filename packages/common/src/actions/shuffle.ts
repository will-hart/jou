import { IGameState } from '../commonTypes'
import { shuffleArray } from '../utilities'

export const shuffleDiscardIntoDraw = (G: IGameState) => {
  G.secret.drawCardIds = shuffleArray([
    ...G.secret.drawCardIds,
    ...G.secret.discardCardIds,
  ])
  G.secret.discardCardIds = []
}

/**
 * Returns all the shuffled cards into the draw pile
 *
 * @param G The game state
 */
export const returnAllPlayedToDiscard = (G: IGameState) => {
  Object.values(G.public).forEach((pub) => {
    G.secret.discardCardIds = [...G.secret.discardCardIds, ...pub.playedCards]
    pub.playedCards = []
  })
}
