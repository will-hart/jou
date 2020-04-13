import DemoGame from '@jou/demo'
// import { Server } from 'boardgame.io/server' // fails
const Server = require('boardgame.io/server').Server

const server = new Server({ games: [DemoGame] })
server.run(8000)

export default server
