import * as React from 'react'
import { useRouter } from 'next/router'

import {
  validateRouterArg,
  getPlayerCredentialsForRoom,
} from '../../../utilities'
import { Card, Alert, AlertType } from '../../../components'
import Head from 'next/head'
import useGameLobby from '../../../hooks/useGameLobby'
import { Room } from '../../../hooks/useLobby'
import { BASE_URL } from '../../../constants'
import GAME_SETTINGS from '../../../components/GameDefinitions'

const getLobby = (
  room: Room | undefined,
  gameName: string,
  roomId: string,
  slot: number,
  push: (url: string) => Promise<boolean>
) => {
  const gameSettings = GAME_SETTINGS[gameName]
  const isReady =
    room && room.players.filter((p) => !p.name).length > gameSettings.minPlayers

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between p-4">
        <h3>Player Slots</h3>
        {room &&
          room.players.map((slot) => (
            <div key={slot.id}>
              <h4>Slot {slot.id}</h4>
              <p className={slot.name ? '' : 'text-gray-200'}>
                {slot.name ? slot.name : 'Empty'}
              </p>
            </div>
          ))}
      </div>

      <div className="mx-auto mt-4">
        <button
          disabled={!isReady}
          onClick={() => push(`/game/${gameName}/${roomId}?playerId=${slot}`)}
          className={`font-bold px-6 py-3
              ${
                isReady
                  ? `bg-green-600 hover:bg-green-700 text-white`
                  : 'bg-gray-300 text-gray-400 cursor-not-allowed'
              }`}
        >
          {isReady ? 'Start' : 'Not Ready'}
        </button>
      </div>
    </>
  )
}

const JoinGamePage = () => {
  const { query, push } = useRouter()
  const gameName = validateRouterArg(query.gameName)
  const roomId = validateRouterArg(query.roomId)

  // if undefined, we are waiting for the page to load - don't request a slot yet
  const slotIdFromStorage = getPlayerCredentialsForRoom(roomId)?.slotId
  const claimedSlot = !roomId
    ? undefined
    : typeof slotIdFromStorage === 'undefined' // slot can be 0 so need to explicitly check for undefined
    ? null
    : slotIdFromStorage

  const { error, room, slot } = useGameLobby(
    BASE_URL,
    gameName,
    roomId,
    claimedSlot
  )

  return (
    <Card>
      <Head>
        <title>Join game - {roomId}</title>
      </Head>

      {error ? (
        <Alert type={AlertType.Error}>{error}</Alert>
      ) : (
        getLobby(room, gameName, roomId, slot, push)
      )}
    </Card>
  )
}

export default JoinGamePage
