import { IGameState } from '@jou/common'
import { Ctx } from 'boardgame.io'

export const applyDemoCardSideEffects = (
  G: IGameState,
  ctx: Ctx,
  cardId: string
): boolean => {
  // try to find an opponent
  const opponentId = Object.keys(G.players).find(
    (pId) => pId !== ctx.currentPlayer
  )
  const opponent = G.players[opponentId]
  if (!opponent) return true

  // find the colour we are matching
  const playedCard = G.cards[cardId]
  if (!playedCard) return true

  // see if we can find a card of the same colour in the opponents played cards
  const matchingCard = G.public[opponent.id].playedCards.find(
    (cId) => G.cards[cId].affinity === playedCard.affinity
  )
  if (!matchingCard) return true

  // move the card to the discard pile
  G.public[opponent.id].playedCards = G.public[opponent.id].playedCards.filter(
    (c) => c !== matchingCard
  )
  G.secret.discardCardIds.push(matchingCard)
}

export const calculateScores = (G: IGameState) => {
  Object.keys(G.players).forEach((playerId) => {
    const colourCounts = G.public[playerId].playedCards.reduce(
      (acc: { [key: string]: number }, cardId: string) => {
        const card = G.cards[cardId]
        const colour = card.affinity

        return {
          ...acc,
          [colour]: (acc[colour] || 0) + 1,
        }
      },
      {} as { [key: string]: number }
    )

    G.public[playerId].score = Object.values(colourCounts).reduce(
      (score: number, count: number) => {
        return score + Math.pow(2, count) - 1
      },
      G.public[playerId].score
    )
  })
}
