import { ICardDefinition } from '@jou/common'

import { CardAffinity } from '@jou/ld46'

export enum CardPlayingState {
  SelectingCard,
  SelectingTarget,
  Apply,
}

export const hasEffect = (card: ICardDefinition, effect: string): boolean => {
  return card.effects.some((eff) => eff.name === effect)
}

export const getNextState = (
  card: ICardDefinition,
  target: string
): CardPlayingState => {
  switch (card.affinity) {
    case CardAffinity.ATTACK:
    case CardAffinity.RETARGET_ATTACK:
      return target ? CardPlayingState.Apply : CardPlayingState.SelectingTarget
    case CardAffinity.EFFECT_SELF:
      return CardPlayingState.Apply
    default:
      throw new Error(`Unknown card affinity ${card.affinity}`)
  }
}
