// const Server = require('boardgame.io/server').Server
import { Server } from 'boardgame.io/server';
import DemoGame from '@jou/demo/src';
const server = Server({ games: [DemoGame] });
server.run(8000);
export default server;
