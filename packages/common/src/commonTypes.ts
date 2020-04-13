export interface IPlayer {
  id: string
  handCardIds: string[]
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
}

export interface IGameState {
  players: { [key: string]: IPlayer }
  cards: { [key: string]: ICardDefinition }
  public: { [key: string]: IPlayerPublicData }
  secret: {
    discardCardIds: string[]
    drawCardIds: string[]
  }
}
