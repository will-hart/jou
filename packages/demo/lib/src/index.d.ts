import { Game } from 'boardgame.io';
export interface IGameState {
    cells: (string | null)[];
}
declare const DemoGame: Game<IGameState>;
export default DemoGame;
