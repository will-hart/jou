import DemoGame from '@jou/demo'
import ByTheSword from '@jou/ld46'

// import { Server } from 'boardgame.io/server' // fails
const Server = require('boardgame.io/server').Server

const server = new Server({ games: [DemoGame, ByTheSword] })
server.run(process.env.PORT || 8000)

export default server
