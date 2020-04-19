import * as React from 'react'
import { Client } from 'boardgame.io/react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { SocketIO } from 'boardgame.io/multiplayer'

// TODO load the correct board for the correct game
// import DemoGame from '@jou/demo'
import ByTheSwordGame /*, { LD46_GAME_ID }*/ from '@jou/ld46'

// import { Board as DemoBoard } from '../../../components/DemoGame'
import { Board as ByTheSwordBoard } from '../../../components/LD46'

import {
  validateRouterArg,
  getPlayerCredentialsForRoom,
} from '../../../utilities'
import { Spinner } from '../../../components'
import { BASE_URL } from '../../../constants'

const GameClient = Client({
  game: ByTheSwordGame,
  board: ByTheSwordBoard,
  multiplayer: SocketIO({ server: BASE_URL }),
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
      {GameClient && (
        <GameClient
          playerID={`${playerId}`}
          gameID={roomId}
          credentials={creds.credential}
        />
      )}
    </>
  )
}

export default GamePage
