import { Ctx } from 'boardgame.io'
import { ByTheSwordState, ITargetedCard } from './state'
import { getEffectInt } from './utilities'
import { EffectType } from './effectDefinitions'

export interface ICombatResolution {
  attackerIds: string[]
  defenderId: string
  attackersCP: number
  defenderCP: number
  attackSucceeded: boolean
  lastingEffects: { effect: string; targetCard: ITargetedCard }[]
}

const sum = (acc: number, item: number) => acc + item

export const resolveSingleCombat = (
  G: ByTheSwordState,
  targetId: string
): ICombatResolution => {
  const targetedCards = G.targetedCards.filter(
    (t) => t.targetedAtId === targetId
  )

  // determine defender CP
  const defenderCard = targetId.startsWith('creature')
    ? G.creatureDeck[targetId]
    : G.characterDeck[targetId]

  const defenderCP =
    getEffectInt(defenderCard, EffectType.OWN_CP) *
      getEffectInt(defenderCard, EffectType.LEVEL) +
    targetedCards
      .map((tc) => getEffectInt(G.cards[tc.cardId], EffectType.TARGET_CP))
      .reduce(sum, 0)

  // who are the attackers
  const attackerIds = [...new Set(targetedCards.map((t) => t.playedById))]

  // what is the attacker CP
  const attackersCP =
    attackerIds
      .map((aId) => getEffectInt(G.characterDeck[aId], EffectType.OWN_CP))
      .reduce(sum, 0) +
    targetedCards
      .map((tc) => getEffectInt(G.cards[tc.cardId], EffectType.OWN_CP))
      .reduce(sum, 0)

  return {
    attackSucceeded: attackersCP >= defenderCP,
    attackersCP,
    attackerIds,
    defenderCP,
    defenderId: targetId,
    lastingEffects: [],
  }
}

const resolveAttackAgainstCreature = (
  G: ByTheSwordState,
  result: ICombatResolution
) => {
  // add popularity to the attackers
  const creature = G.creatureDeck[result.defenderId]
  const creatureLevel = getEffectInt(creature, EffectType.LEVEL)

  // TODO level specific
  const popularity =
    getEffectInt(creature, EffectType.PURCHASE_COST) * creatureLevel
  G.arenaScore += popularity

  for (let i = 0; i < result.attackerIds.length; ++i) {
    const player = G.public[result.attackerIds[i]]
    if (!player) continue
    player.score += popularity
  }

  // the creature is killed, discard it, it should automatically return to the pool
  console.log(
    'combat remove creature',
    G.currentCreatures,
    G.currentCreatures.filter((c) => c !== result.defenderId),
    result.defenderId
  )
  G.currentCreatures = G.currentCreatures.filter((c) => c !== result.defenderId)

  // bump the creature level
  G.creatureDeck[result.defenderId].effects.find(
    (e) => e.name === EffectType.LEVEL
  ).value = creatureLevel + 1
}

export const resolveCombat = (G: ByTheSwordState) => {
  // work out each combat one at a time
  const targetIds = [...new Set(G.targetedCards.map((tc) => tc.targetedAtId))]

  // calculate results
  const results = targetIds.map((tId) => resolveSingleCombat(G, tId))
  console.log('resolving', results)

  // do something else clever with the results
  console.warn('Combat resolution lasting effects are not implemented')
  // applyLastingEffects(G, results)

  // remove defeated enemies
  for (const result of results) {
    if (!result.attackSucceeded) continue

    if (result.defenderId.startsWith('character')) {
      console.warn('Combat resolution against players is not implemented')
      // resolveAttackAgainstPlayer(G, result)
      continue
    }

    console.log('RESOLVING', result)
    resolveAttackAgainstCreature(G, result)
  }
}
