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
  const slotIdFromStorage = getPlayerCredentialsForRoom(roomId)?.slotId
  const claimedSlot = !roomId
    ? undefined
    : typeof slotIdFromStorage === 'undefined' // slot can be 0 so need to explicitly check for undefined
    ? null
    : slotIdFromStorage

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
