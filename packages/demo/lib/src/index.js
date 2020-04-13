"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DemoGame = {
    setup: () => ({ cells: Array(9).fill(null) }),
    moves: {
        clickCell: (G, ctx, id) => {
            G.cells[id] = ctx.currentPlayer;
        },
    },
    endIf: (G, ctx) => {
        if (G.cells.filter((c) => c !== null).length > 5) {
            return { winner: ctx.currentPlayer };
        }
    },
    turn: {
        moveLimit: 1,
    },
};
exports.default = DemoGame;
