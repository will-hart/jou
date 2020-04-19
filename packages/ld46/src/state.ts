import {
  ICardDefinition,
  Deck,
  IPlayerPrivateData,
  IGameState,
  shuffleArray,
  ISecretData,
  IPlayerPublicData,
} from '@jou/common'
import { EffectType } from './effectDefinitions'
import { MAX_ACTIONS } from './constants'

export interface IPlayerPublic extends IPlayerPublicData {
  id: number
  fighters: string[]
  passed: boolean
}

export interface ITargetedCard {
  playedById: string
  targetedAtId: string
  targetIsCreature: boolean // false implies player
  cardId: string
}

export interface ByTheSwordState
  extends IGameState<IPlayerPrivateData, IPlayerPublic, ISecretData> {
  isInitialDraft: boolean
  arenaScore: number
  endMessage?: string

  availableCharacters: string[]
  availableCreatures: string[]

  characterDeck: { [key: string]: ICardDefinition }
  creatureDeck: { [key: string]: ICardDefinition }

  currentCreatures: string[]

  targetedCards: ITargetedCard[]
}

export const stateFactory = (
  actionDeck: Deck,
  creatureDeck: Deck,
  characterDeck: Deck,
  numPlayers: number
): ByTheSwordState => {
  return {
    arenaScore: 0,
    endMessage: null,
    isInitialDraft: true,

    cards: actionDeck.cards.reduce((acc, item) => {
      return { ...acc, [item.id]: item }
    }, {}),
    characterDeck: characterDeck.cards.reduce((acc, item) => {
      return { ...acc, [item.id]: item }
    }, {}),
    creatureDeck: creatureDeck.cards.reduce((acc, item) => {
      return { ...acc, [item.id]: item }
    }, {}),

    players: {
      ...Array(numPlayers)
        .fill(null)
        .map(
          (_, idx): IPlayerPrivateData => ({
            id: idx.toString(),
            handCardIds: [],
            maxHandSize: MAX_ACTIONS,
          })
        )
        .reduce((acc, item) => {
          return { ...acc, [item.id]: item }
        }, {} as { [key: string]: IPlayerPrivateData }),
    },
    availableCards: [],
    availableCharacters: characterDeck.cards
      .filter((card: ICardDefinition) =>
        card.effects.some((e) => e.name === EffectType.INITIAL)
      )
      .map((c) => c.id),

    // creatures that can be drafted
    availableCreatures: [],

    secret: {
      discardCardIds: [],
      drawCardIds: shuffleArray(actionDeck.cards.map((c) => c.id)),
    },
    rules: { availableCardSize: 0, usePersonalDeck: false },

    currentCreatures: [],

    targetedCards: [],

    public: Array(numPlayers)
      .fill(null)
      .reduce((acc, _, idx) => {
        const newPublicPlayer: IPlayerPublic = {
          id: idx,
          name: `Player ${idx}`,
          score: 5,
          isAway: false,
          fighters: [],
          passed: false,
          handSize: 0,
          playedCards: [],
        }

        return {
          ...acc,
          [idx]: newPublicPlayer,
        }
      }, {}),
  }
}
