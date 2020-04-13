import * as React from 'react'

import { Ctx, Game } from 'boardgame.io'
import { Client } from 'boardgame.io/react'

interface IGameState {
  cells: (string | null)[]
}

const DemoGame: Game<IGameState> = {
  setup: () => ({ cells: Array(9).fill(null) }),

  moves: {
    clickCell: (G: IGameState, ctx: Ctx, id: number) => {
      G.cells[id] = ctx.currentPlayer
    },
  },

  endIf: (G: IGameState, ctx: Ctx) => {
    if (G.cells.filter((c) => c !== null).length > 3) {
      return { winner: ctx.currentPlayer }
    }
  },

  turn: {
    moveLimit: 1,
  },
}

const App = Client({ game: DemoGame })

const GamePage = () => {
  return <App />
}

export default GamePage
