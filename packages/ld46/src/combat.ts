import { Ctx } from 'boardgame.io'
import { ByTheSwordState } from './state'

export const resolveCombat = (G: ByTheSwordState, ctx: Ctx) => {
  console.warn('Combat resolution not implemented')

  if (G.currentCreatures.length === 0) {
    ctx.events.setPhase('draftFighters')
  } else {
    ctx.events.setPhase('draftHand')
  }
}
