import { Game, Ctx } from 'boardgame.io'
import { PlayerView } from 'boardgame.io/core'

import { ByTheSwordState, stateFactory } from './state'
import {
  draftFighter,
  fillCreatureDeck,
  draftCreature,
  discardAndRedraw,
  pass,
  playCardWithTarget,
} from './moves'
import { actionDeck, creatureDeck, fighterDeck } from './cardDefinitions'
import {
  SINGLE_PLAYER_WIN_SCORE,
  TEAM_WIN_SCORE,
  LD46_GAME_ID,
} from './constants'
import { resolveCombat } from './combat'

const ByTheSwordGame: Game<ByTheSwordState> = {
  setup: (ctx: Ctx, setupData: unknown): ByTheSwordState => {
    console.log(ctx, setupData)
    return stateFactory(actionDeck, creatureDeck, fighterDeck, 2)
  },

  name: LD46_GAME_ID,

  phases: {
    initialFighterDraft: {
      start: true,
      next: 'draftCreatures',
      endIf: (G: ByTheSwordState) => !G.isInitialDraft,
      moves: {
        draftFighter,
      },
      turn: { moveLimit: 1 },
    },
    draftFighters: {
      next: 'draftCreatures',
      moves: {
        draftFighter,
      },
      turn: { moveLimit: 1 },
    },
    draftCreatures: {
      onBegin: fillCreatureDeck,
      next: 'draftHand',
      turn: { moveLimit: 1 },
      moves: {
        draftCreature,
      },
    },
    draftHand: {
      next: 'playHand',
      turn: { moveLimit: 1 },
      moves: { discardAndRedraw },
    },
    playHand: {
      next: 'resolveHand',
      endIf: (G: ByTheSwordState) => {
        // lots of double negation here.
        // Basically we want to see if anybody still has a move
        return !Object.keys(G.public).some((key) => {
          const pub = G.public[key]
          const priv = G.players[key]

          const hasCompletedMove =
            pub.playedCards.length >= pub.fighters.length ||
            pub.passed ||
            priv.handCardIds.length === 0
          return !hasCompletedMove
        })
      },
      onEnd: (G: ByTheSwordState) => {
        // clear all the passed players
        Object.values(G.public).forEach((p) => (p.passed = false))
      },
      moves: {
        // one option is to pass
        pass,
        playCardWithTarget,
      },
      turn: {
        onBegin: (G: ByTheSwordState, ctx: Ctx) => {
          if (G.public[ctx.currentPlayer].passed) {
            // skip turns of players who have previously passed
            return ctx.events.endTurn()
          }
        },
      },
    },
    resolveHand: {
      // next: '' <<- depends on the outcome of resolution
      onBegin: resolveCombat,
      onEnd: (G: ByTheSwordState) => {
        // clear all the card targets
        G.targetedCards = []
      },
    },
  },

  endIf: (G: ByTheSwordState) => {
    const playersAlive = Object.values(G.public).filter((p) => !p.isAway)
    const singleWinner = playersAlive.length === 1

    if (playersAlive.length === 0) {
      G.endMessage = 'You were defeated!'
      return true
    }

    if (singleWinner && playersAlive[0].score > SINGLE_PLAYER_WIN_SCORE) {
      G.endMessage = `${playersAlive[0].id} won!`
      return true
    } else if (!singleWinner && G.arenaScore > TEAM_WIN_SCORE) {
      G.endMessage = 'All players won!'
      return true
    }

    return false
  },

  playerView: PlayerView.STRIP_SECRETS,
}

export default ByTheSwordGame
// export * from './layout'
export * from './constants'
