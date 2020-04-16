import * as React from 'react'
import { Client } from 'boardgame.io/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SocketIO } from 'boardgame.io/multiplayer'
// import { Local } from 'boardgame.io/multiplayer'

import DemoGame from '@jou/demo'
import { Board } from '../components/DemoGame'

const GameClient = Client({
  game: DemoGame,
  board: Board,
  multiplayer: SocketIO({ server: 'localhost:8000' }),
  // multiplayer: Local(),
})

const GamePage = () => {
  const { query } = useRouter()
  const playerId = Array.isArray(query.playerId)
    ? query.playerId[0]
    : query.playerId

  if (!playerId) return <p>LOADING...</p>

  console.log(`Assuming player ID '${playerId}'`)
  return (
    <>
      <Head>
        <title>Jou Demo Game</title>
      </Head>
      <GameClient playerID={`${playerId}`} />
    </>
  )
}

export default GamePage
