export interface IPlayerPrivateData {
  id: string
  handCardIds: string[]
  personalDraw?: string[]
  personalDiscard?: string[]
  maxHandSize: number
}

export interface IEffectDefinition {
  name: string
  value: string | number
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

export interface ISecretData {
  discardCardIds: string[]
  drawCardIds: string[]
}

// TODO: for "genericisation" have a "decks" array, which is an array of IDeck
//       generic pick/shuffle/replace operations can be carried out on these decks.
//       The deck object includes draw/discard/hand piles and is identified by a string ID
//       See github issue #10
export interface IGameState<
  TPlayerPrivate extends IPlayerPrivateData,
  TPlayerPublic extends IPlayerPublicData,
  TSecret extends ISecretData
> {
  players: { [key: string]: TPlayerPrivate }
  cards: { [key: string]: ICardDefinition }
  public: { [key: string]: TPlayerPublic }
  availableCards: string[]
  secret: TSecret
  rules: {
    availableCardSize: number
    usePersonalDeck: boolean
  }
}

// shortcut to default interface used in e.g. demo
export type IDefaultGameState = IGameState<
  IPlayerPrivateData,
  IPlayerPublicData,
  ISecretData
>
