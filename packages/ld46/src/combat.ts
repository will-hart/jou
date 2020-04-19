import { Ctx } from 'boardgame.io'
import { ByTheSwordState, ITargetedCard } from './state'
import { ICardDefinition } from '@jou/common'
import { getEffectInt } from './utilities'
import { EffectType, LASTING_EFFECTS } from './effectDefinitions'

export interface ICombatResolution {
  attackerIds: string[]
  defenderId: string
  attackersCP: number
  defenderCP: number
  attackSucceeded: boolean
  lastingEffects: { effect: string; targetCard: ITargetedCard }[]
}

export const getCP = (
  G: ByTheSwordState,
  target: ICardDefinition,
  attackingCards: ITargetedCard[],
  isDefending = false
): number => {
  return attackingCards.reduce((acc: number, item: ITargetedCard) => {
    return (
      acc +
      getEffectInt(
        G.cards[item.cardId],
        isDefending ? EffectType.TARGET_CP : EffectType.OWN_CP
      )
    )
  }, getEffectInt(target, EffectType.OWN_CP))
}

export const getLastingEffects = (
  G: ByTheSwordState,
  cards: ITargetedCard[]
): { effect: string; targetCard: ITargetedCard }[] => {
  return cards
    .map((card) => ({ effect: G.cards[card.cardId].effects, targetCard: card }))
    .flat()
    .filter(({ effect }) => {
      return LASTING_EFFECTS.includes(effect.name as EffectType)
    })
}

export const getCombatResolutionForTarget = (
  G: ByTheSwordState,
  targetId: string
): ICombatResolution => {
  const cards = G.targetedCards.filter((tc) => tc.targetedAtId === targetId)

  // calculte the defenders CP
  const target = targetId.startsWith('creature')
    ? G.creatureDeck[targetId]
    : G.characterDeck[targetId]

  const defenderCP = getCP(G, target, cards, true)
  const attackersCP = cards.reduce((acc: number, item: ITargetedCard) => {
    const attacker = item.targetIsCreature
      ? G.creatureDeck[item.cardId]
      : G.characterDeck[item.cardId]
    return (
      acc +
      getEffectInt(G.cards[item.cardId], EffectType.OWN_CP) +
      getEffectInt(attacker, EffectType.OWN_CP)
    )
  }, 0)

  return {
    attackSucceeded: attackersCP >= defenderCP,
    attackerIds: cards.map((card) => card.playedById),
    attackersCP,
    defenderId: targetId,
    defenderCP: 0,
    lastingEffects: getLastingEffects(G, cards),
  }
}

const applyLastingEffects = (
  _G: ByTheSwordState,
  _results: ICombatResolution[]
) => {
  console.warn('Result lasting effects currently not applied')
}

const resolveAttackAgainstPlayer = (
  G: ByTheSwordState,
  result: ICombatResolution
) => {
  const player = Object.values(G.public).find((pub) =>
    pub.fighters.includes(result.defenderId)
  )

  if (!player) {
    console.warn(
      `Unable to find a player with fighter ${
        result.defenderId
      } from attackers ${JSON.stringify(result.attackerIds)}`
    )
    return
  }

  player.score = Math.max(
    0,
    player.score - result.attackersCP + result.defenderCP
  )
}

const resolveAttackAgainstCreature = (
  G: ByTheSwordState,
  result: ICombatResolution
) => {
  // add popularity to the attackers
  const creature = G.creatureDeck[result.defenderId]
  const creatureLevel = parseInt(
    creature.effects.find((e) => e.name === EffectType.LEVEL).value.toString(),
    10
  )

  // TODO level specific
  const popularity =
    getEffectInt(creature, EffectType.PURCHASE_COST) * creatureLevel
  G.arenaScore += popularity

  for (const attackerId of result.attackerIds) {
    const player = G.public[attackerId]
    if (!player) continue

    player.score += popularity
  }

  // the creature is killed, discard it, it should automatically return to the pool
  G.currentCreatures = G.currentCreatures.filter((c) => c !== result.defenderId)

  // bump the creature level
  G.creatureDeck[result.defenderId].effects.find(
    (e) => e.name === EffectType.LEVEL
  ).value = creatureLevel + 1
}

export const resolveCombat = (G: ByTheSwordState, ctx: Ctx) => {
  console.warn('Combat resolution not implemented')

  // work out each combat one at a time
  const targetIds = Array.from(
    new Set(G.targetedCards.map((tc) => tc.targetedAtId))
  )

  // calculate results
  const results = targetIds.map((tId) => getCombatResolutionForTarget(G, tId))

  // do something else clever with the results
  applyLastingEffects(G, results)

  // remove defeated enemies
  for (const result of results) {
    if (!result.attackSucceeded) continue

    if (result.defenderId.startsWith('character')) {
      resolveAttackAgainstPlayer(G, result)
      continue
    }

    resolveAttackAgainstCreature(G, result)
  }

  if (G.currentCreatures.length === 0) {
    ctx.events.setPhase('draftFighters')
  } else {
    ctx.events.setPhase('draftHand')
  }
}
