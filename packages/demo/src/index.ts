import { Game } from 'boardgame.io'
import { PlayerView } from 'boardgame.io/core'
import {
  drawToFullHand,
  IGameState,
  playCard,
  canPlayCard,
  returnAllPlayedToDiscard,
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
        returnAllPlayedToDiscard(G)
        shuffleDiscardIntoDraw(G)
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
      onEnd: calculateScores,
      endIf: (G: IGameState) =>
        !Object.keys(G.players).some(
          (p) => G.players[p].handCardIds.length > 1
        ),
    },
  },

  endIf: (G: IGameState) => {
    return Object.keys(G.players).some((p) => G.public[p].score >= 30)
  },

  playerView: PlayerView.STRIP_SECRETS,
}

export default DemoGame
