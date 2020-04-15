import { Game, Ctx } from 'boardgame.io'
import { PlayerView } from 'boardgame.io/core'
import {
  drawToFullHand,
  IGameState,
  playCard,
  canPlayCard,
  moveAllPlayedToDiscard,
  shuffleDiscardIntoDraw,
} from '@jou/common'

import { deck } from './cardDefinitions'
import { stateFactory } from './factory'
import { applyDemoCardSideEffects, calculateScores } from './sideEffects'

const DemoGame: Game<IGameState> = {
  setup: (ctx, setupData): IGameState => {
    console.log(ctx, setupData)
    return stateFactory(deck, 2)
  },

  phases: {
    drawToFull: {
      start: true,
      next: 'play',
      turn: { moveLimit: 1 },
      moves: {
        drawToFullHand: { move: drawToFullHand, client: false },
      },
      onBegin: (G: IGameState) => {
        console.log('Entering "drawToFull" phase')
        moveAllPlayedToDiscard(G)
        shuffleDiscardIntoDraw(G)
      },
      onEnd: (G: IGameState) => {
        Object.values(G.players).forEach((player) => {
          // sort hand cards by affinity
          player.handCardIds.sort((a, b) =>
            G.cards[a].affinity.localeCompare(G.cards[b].affinity)
          )
        })
      },
      endIf: (G: IGameState) =>
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
      onEnd: (G: IGameState, ctx: Ctx) => {
        calculateScores(G)
        ctx.events.endTurn() // alternate who goes first
      },
      endIf: (G: IGameState) =>
        !Object.keys(G.players).some(
          (p) => G.players[p].handCardIds.length > 2
        ),
    },
  },

  endIf: (G: IGameState) => {
    return Object.keys(G.players).some((p) => G.public[p].score >= 30)
  },

  playerView: PlayerView.STRIP_SECRETS,
}

export default DemoGame
export * from './layout'
