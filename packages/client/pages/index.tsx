import * as React from 'react'
import { Client } from 'boardgame.io/react'

import DemoGame from '@jou/demo'

const App = Client({ game: DemoGame })

const GamePage = () => {
  return <App />
}

export default GamePage
