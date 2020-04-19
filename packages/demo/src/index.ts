import { Game, Ctx } from 'boardgame.io'
import { PlayerView } from 'boardgame.io/core'
import {
  drawToFullHand,
  IDefaultGameState,
  playCard,
  canPlayCard,
  moveAllPlayedToDiscard,
  shuffleDiscardIntoDraw,
} from '@jou/common'

import { deck } from './cardDefinitions'
import { stateFactory } from './factory'
import { applyDemoCardSideEffects, calculateScores } from './sideEffects'

const DemoGame: Game<IDefaultGameState> = {
  setup: (ctx, setupData): IDefaultGameState => {
    console.log(ctx, setupData)
    return stateFactory(deck, 2)
  },

  name: 'demo',

  phases: {
    drawToFull: {
      start: true,
      next: 'play',
      turn: { moveLimit: 1 },
      moves: {
        drawToFullHand: { move: drawToFullHand, client: false },
      },
      onBegin: (G: IDefaultGameState) => {
        console.log('Entering "drawToFull" phase')
        moveAllPlayedToDiscard(G)
        shuffleDiscardIntoDraw(G)
      },
      onEnd: (G: IDefaultGameState) => {
        Object.values(G.players).forEach((player) => {
          // sort hand cards by affinity
          player.handCardIds.sort((a, b) =>
            G.cards[a].affinity.localeCompare(G.cards[b].affinity)
          )
        })
      },
      endIf: (G: IDefaultGameState) =>
        !Object.keys(G.players).some(
          (p) => G.players[p].maxHandSize !== G.players[p].handCardIds.length
        ),
    },
    play: {
      next: 'drawToFull',
      turn: { moveLimit: 1 },
      moves: {
        playCard: playCard(canPlayCard, applyDemoCardSideEffects),
      },
      onBegin: () => console.log('Entering "play" phase'),
      onEnd: (G: IDefaultGameState, ctx: Ctx) => {
        calculateScores(G)
        ctx.events.endTurn() // alternate who goes first
      },
      endIf: (G: IDefaultGameState) =>
        !Object.keys(G.players).some(
          (p) => G.players[p].handCardIds.length > 2
        ),
    },
  },

  endIf: (G: IDefaultGameState) => {
    return Object.keys(G.players).some((p) => G.public[p].score >= 30)
  },

  playerView: PlayerView.STRIP_SECRETS,
}

export default DemoGame
export * from './layout'
