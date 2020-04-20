import { Ctx } from 'boardgame.io'

import { ByTheSwordState } from './state'
import { INVALID_MOVE } from 'boardgame.io/core'
import { EffectType } from './effectDefinitions'
import { creatureDeck } from './cardDefinitions'
import {
  shuffleArray,
  drawToFullHand,
  playCard,
  canPlayCard,
} from '@jou/common'
import { MAX_CREATURES, MAX_CHARACTERS } from './constants'

// TODO: make @jou/common/draw more generic so we can use it here
//       will need to make IGameState more generic to make this work
//       i.e. take generic type params for public/secret/player
export const draftFighter = (
  G: ByTheSwordState,
  ctx: Ctx,
  fighterId: string
) => {
  if (!G.availableCharacters.includes(fighterId)) {
    console.warn(
      `Player ${ctx.currentPlayer} attempted to get character ${fighterId} which is unavailable`
    )
    return INVALID_MOVE
  }

  // unable to draft any more characters
  if (G.currentCreatures.length >= MAX_CHARACTERS) {
    console.warn(
      `Player ${ctx.currentPlayer} tried to purchase ${fighterId}, however the fighter count is at the limit ${MAX_CHARACTERS}. Aborting.`
    )
    return INVALID_MOVE
  }

  const fighter = G.characterDeck[fighterId]
  const cost = G.isInitialDraft
    ? 0
    : parseInt(
        fighter.effects
          .find((e) => e.name === EffectType.PURCHASE_COST)
          .value.toString(),
        10
      )

  const player = G.public[ctx.currentPlayer]

  if (player.score < cost) {
    console.warn(
      `Player ${ctx.currentPlayer} attempted to get character ${fighterId} for ${cost} but only has ${player.score}`
    )
    return INVALID_MOVE
  }

  // player has purchased, remove from available and add to player
  G.availableCharacters = G.availableCharacters.filter((c) => c !== fighterId)
  player.fighters.push(fighterId)
  player.score -= cost

  // if it is currently initial, check if we have completed initial draft
  if (!G.isInitialDraft) return

  const isStillInitial = Object.values(G.public).some(
    (p) => p.fighters.length === 0
  )
  G.isInitialDraft = isStillInitial
}

export const fillCreatureDeck = (G: ByTheSwordState) => {
  const numMissingCreatures = MAX_CREATURES - G.currentCreatures.length

  G.availableCreatures = [
    ...G.availableCreatures,
    ...shuffleArray(
      Object.keys(G.creatureDeck).filter(
        (k) =>
          !G.currentCreatures.includes(k) && !G.availableCreatures.includes(k)
      )
    ).slice(0, numMissingCreatures),
  ]
}

export const draftCreature = (
  G: ByTheSwordState,
  ctx: Ctx,
  creatureId?: string
) => {
  // player passed
  if (!creatureId) {
    console.log(
      `Player ${ctx.currentPlayer} elected not to purchase a creature`
    )
    return
  }

  // unable to draft any more creatures
  if (G.currentCreatures.length >= MAX_CREATURES) {
    console.warn(
      `Player ${ctx.currentPlayer} tried to purchase ${creatureId}, however the creature count is at the limit ${MAX_CREATURES}. Aborting.`
    )
    return INVALID_MOVE
  }

  // creature is not available
  if (!G.availableCreatures.includes(creatureId)) {
    console.warn(
      `Player ${ctx.currentPlayer} tried to purchase ${creatureId}, however the creature is not available. Aborting.`
    )
    return INVALID_MOVE
  }

  const creature = G.creatureDeck[creatureId]
  const cost = parseInt(
    creature.effects
      .find((e) => e.name === EffectType.PURCHASE_COST)
      .value.toString(),
    10
  )

  if (G.arenaScore < cost) {
    console.warn(
      `Player ${ctx.currentPlayer} attempted to get character ${creatureId} for ${cost} but only has ${G.arenaScore}`
    )
    return INVALID_MOVE
  }

  // ok, draft the creature
  G.arenaScore -= cost
  G.availableCreatures = G.availableCreatures.filter((k) => k !== creatureId)
  G.currentCreatures.push(creatureId)
}

export const discardAndRedraw = (
  G: ByTheSwordState,
  ctx: Ctx,
  cardId?: string
) => {
  const player = G.players[ctx.currentPlayer]
  if (!player) return INVALID_MOVE

  // player passed
  if (!cardId) {
    console.log(`Player ${ctx.currentPlayer} elected not to discard a hand`)
  } else {
    // creature is not available
    if (!player.handCardIds.includes(cardId)) {
      console.warn(
        `Player ${ctx.currentPlayer} tried to discard ${cardId}, however this card is not in their hand. Aborting.`
      )
      return INVALID_MOVE
    }

    // discard the card
    player.handCardIds = player.handCardIds.filter((c) => c !== cardId)

    // add the card to the action discard pile
    G.secret.discardCardIds.push(cardId)
  }

  // mark as done
  G.public[ctx.currentPlayer].passed = true

  // draw up to full
  drawToFullHand(G, ctx)
}

// a NOP move, and NOPs all future moves for this player
export const pass = (G: ByTheSwordState, ctx: Ctx) => {
  G.public[ctx.currentPlayer].passed = true
}

// all side effects are applied in the resolution phase
const _playCardHandler = playCard(canPlayCard, () => true)

export const playCardWithTarget = (
  G: ByTheSwordState,
  ctx: Ctx,
  cardId: string,
  targetId?: string,
  targetIsCreature?: boolean
) => {
  const wasPlayed = _playCardHandler(G, ctx, cardId)
  if (!wasPlayed) {
    console.log(`Player ${ctx.currentPlayer} unable to play card ${cardId}`)
    return INVALID_MOVE
  }

  G.targetedCards.push({
    cardId,
    playedById: ctx.currentPlayer,
    targetIsCreature,
    targetedAtId: targetId,
  })
}
