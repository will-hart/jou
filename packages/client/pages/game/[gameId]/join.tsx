import * as React from 'react'
import { useRouter } from 'next/router'

import {
  validateRouterArg,
  getPlayerCredentialsForRoom,
} from '../../../utilities'
import { Card, Alert, AlertType } from '../../../components'
import Head from 'next/head'
import useGameLobby from '../../../hooks/useGameLobby'

const JoinGamePage = () => {
  const { query } = useRouter()
  const roomId = validateRouterArg(query.roomId)

  // if undefined, we are waiting for the page to load - don't request a slot yet
  const claimedSlot = !roomId
    ? undefined
    : getPlayerCredentialsForRoom(roomId)?.slotId || null

  const { error, room } = useGameLobby(
    'http://localhost:8000',
    'demo',
    roomId,
    claimedSlot
  )

  return (
    <Card>
      <Head>
        <title>Join game - {roomId}</title>
      </Head>

      {JSON.stringify(room)}

      {error && <Alert type={AlertType.Error}>{error}</Alert>}
    </Card>
  )
}

export default JoinGamePage
