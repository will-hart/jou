import { ICardDefinition } from '@jou/common'

export const getEffect = (
  card: ICardDefinition,
  effect: string
): string | number | null => {
  return card.effects.find((eff) => eff.name === effect)?.value || null
}

export const getEffectInt = (card: ICardDefinition, effect: string): number => {
  const val = getEffect(card, effect)

  if (!val) return 0
  return parseInt(val.toString(), 10)
}
