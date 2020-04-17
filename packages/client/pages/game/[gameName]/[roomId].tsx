import * as React from 'react'
import { Client } from 'boardgame.io/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SocketIO } from 'boardgame.io/multiplayer'
// import { Local } from 'boardgame.io/multiplayer'

import DemoGame from '@jou/demo'
import { Board } from '../../../components/DemoGame'
import {
  validateRouterArg,
  getPlayerCredentialsForRoom,
} from '../../../utilities'
import { Spinner } from '../../../components'
import { BASE_URL } from '../../../constants'

const GameClient = Client({
  game: DemoGame,
  board: Board,
  multiplayer: SocketIO({ server: BASE_URL }),
  // multiplayer: Local(),
})

const GamePage = () => {
  const { query } = useRouter()
  const gameName = validateRouterArg(query.gameName)
  const roomId = validateRouterArg(query.roomId)
  const playerId = validateRouterArg(query.playerId)
  const creds = roomId && getPlayerCredentialsForRoom(roomId)

  if (!playerId || !gameName || !roomId || !creds) return <Spinner />

  console.log(`Assuming player ID '${playerId}'`)
  return (
    <>
      <Head>
        <title>Jou Demo Game</title>
      </Head>
      <GameClient
        playerID={`${playerId}`}
        gameID={roomId}
        credentials={creds.credential}
      />
    </>
  )
}

export default GamePage
