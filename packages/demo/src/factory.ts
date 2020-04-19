import {
  Deck,
  IDefaultGameState,
  IPlayerPrivateData,
  shuffleArray,
} from '@jou/common'

export const stateFactory = (
  deck: Deck,
  numPlayers: number
): IDefaultGameState => {
  return {
    players: {
      ...Array(numPlayers)
        .fill(null)
        .map(
          (_, id): IPlayerPrivateData => ({
            id: `${id}`,
            maxHandSize: 5,
            handCardIds: [],
          })
        )
        .reduce((acc, item) => {
          return { ...acc, [item.id]: item }
        }, {}),
    },
    availableCards: [], // not used here
    cards: deck.cards.reduce((acc, item) => {
      return { ...acc, [item.id]: item }
    }, {}),
    public: {
      '0': {
        score: 0,
        handSize: 0,
        playedCards: [],
        isAway: false,
        name: 'Player 0',
      },
      '1': {
        score: 0,
        handSize: 0,
        playedCards: [],
        isAway: false,
        name: 'Player 1',
      },
    },
    secret: {
      discardCardIds: [],
      drawCardIds: shuffleArray(deck.cards.map((c) => c.id)),
    },
    rules: {
      availableCardSize: 0,
      usePersonalDeck: false,
    },
  }
}
