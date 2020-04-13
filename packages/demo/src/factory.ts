import { Deck, IGameState, IPlayer, shuffleArray } from '@jou/common'

export const stateFactory = (deck: Deck, numPlayers: number): IGameState => {
  return {
    players: {
      ...Array(numPlayers)
        .fill(null)
        .map(
          (_, id): IPlayer => ({
            id: `${id}`,
            maxHandSize: 5,
            handCardIds: [],
          })
        )
        .reduce((acc, item) => {
          return { ...acc, [item.id]: item }
        }, {}),
    },
    cards: deck.cards.reduce((acc, item) => {
      return { ...acc, [item.id]: item }
    }, {}),
    public: {
      '0': { score: 0, handSize: 0, playedCards: [] },
      '1': { score: 0, handSize: 0, playedCards: [] },
    },
    secret: {
      discardCardIds: [],
      drawCardIds: shuffleArray(deck.cards.map((c) => c.id)),
    },
  }
}
