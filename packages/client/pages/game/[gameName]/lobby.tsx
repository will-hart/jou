import * as React from 'react'
import { useRouter } from 'next/router'

import { validateRouterArg } from '../../../utilities'
import { Card, Spinner } from '../../../components'
import useLobby from '../../../hooks/useLobby'
import Head from 'next/head'
import RoomList from '../../../components/Lobby/RoomList'
import { BASE_URL } from '../../../constants'

const LobbyPage = () => {
  const { query, push } = useRouter()
  const gameId = validateRouterArg(query.gameId)

  const { createAndJoinGame, loading, roomList } = useLobby(
    BASE_URL,
    'demo',
    push
  )

  return (
    <Card>
      <Head>
        <title>Game browser - {gameId}</title>
      </Head>
      <div className="flex-row flex justify-between">
        <h2>Game browser</h2>
        <button
          className="text-green-600 font-bold"
          onClick={createAndJoinGame}
          disabled={loading}
        >
          {loading ? <Spinner small /> : '+ Create'}
        </button>
      </div>

      <RoomList loading={loading} rooms={roomList?.rooms} />
    </Card>
  )
}

export default LobbyPage
