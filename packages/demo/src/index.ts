import { Ctx, Game } from 'boardgame.io'

export interface IGameState {
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
    if (G.cells.filter((c) => c !== null).length > 5) {
      return { winner: ctx.currentPlayer }
    }
  },

  turn: {
    moveLimit: 1,
  },
}

export default DemoGame
