export interface IPlayer {
  id: string
  handCardIds: string[]
  personalDraw?: string[]
  personalDiscard?: string[]
  maxHandSize: number
}

export interface IEffectDefinition {
  name: string
  value: string
}

export interface ICardDefinition {
  id: string
  imagePath: string
  effects: IEffectDefinition[]
  affinity: string
}

export interface Deck {
  cards: ICardDefinition[]
}

export enum CardLocations {
  DRAW,
  DISCARD,
  HAND,
  PLAYED,
}

export interface IPlayerPublicData {
  playedCards: string[]
  handSize: number
  score: number
  isAway: boolean
  name: string
}

export interface IGameState {
  players: { [key: string]: IPlayer }
  cards: { [key: string]: ICardDefinition }
  public: { [key: string]: IPlayerPublicData }
  availableCards: string[]
  secret: {
    discardCardIds: string[]
    drawCardIds: string[]

    rules: {
      availableCardSize: number
      usePersonalDeck: boolean
    }
  }
}
