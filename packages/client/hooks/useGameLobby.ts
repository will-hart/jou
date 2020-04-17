import ky from 'ky-universal'
import { useState, useEffect, useCallback } from 'react'
import { Room } from './useLobby'
import useInterval from './useInterval'
import { storePlayerCredentials } from '../utilities'

enum LobbyJoinState {
  PREPARING,
  INIT,
  READY_TO_JOIN,
  JOINING,
  JOINED,
  ERROR,
}

const useGameLobby = (
  url: string,
  gameName: string,
  gameId: string,
  claimedSlot: number | null,
  verbose = false
) => {
  const [room, setRoom] = useState<Room>()
  const [error, setError] = useState<string>('')
  const [slot, setSlot] = useState<number>(claimedSlot)
  const [lobbyState, setLobbyState] = useState<LobbyJoinState>(null)

  // if a slot ID is provided, we have already joined. Go straight to JOINED state
  useEffect(() => {
    if (claimedSlot === null) {
      // no slot has been claimed - attempt to join
      setLobbyState(LobbyJoinState.INIT)
    } else if (typeof claimedSlot === 'undefined') {
      // waiting for the join page to load properly
      setLobbyState(LobbyJoinState.PREPARING)
    } else {
      // a slot has already been claimed!
      setSlot(claimedSlot)
      setLobbyState(LobbyJoinState.JOINED)
    }
  }, [claimedSlot])

  const refreshRoom = useCallback(async (): Promise<void> => {
    // items are not populated
    if (!url || !gameName || !gameId) {
      if (verbose) console.log('RefreshRoom incomplete args')
      return
    }

    // if we are still "preparing" the join page (i.e. recovering from SSR)
    // or the lobby is not in the correct state, abort refreshRoom request
    if (
      !lobbyState ||
      ![LobbyJoinState.INIT, LobbyJoinState.JOINED].includes(lobbyState)
    ) {
      if (verbose)
        console.log('Refresh room incompatible lobby state', lobbyState)
      return
    }

    const room: Room = await ky.get(`${url}/games/${gameName}/${gameId}`).json()
    setRoom(room)

    if (lobbyState === LobbyJoinState.INIT) {
      setLobbyState(LobbyJoinState.READY_TO_JOIN)
    }
  }, [lobbyState, url, gameName, gameId, verbose])

  // set up some interval hooks for tracking the game state (to see when all players have joined)
  const [pollInterval, setPollInterval] = useState<number>(undefined)
  const clearPollInterval = () => setPollInterval(undefined)
  useInterval(() => {
    if (verbose) console.log('Polling')
    refreshRoom().catch(console.error)
  }, pollInterval)

  // when the room is returned and we are ready to join
  // find an available free slot and attempt to join it
  useEffect(() => {
    // should be in idle state before requesting
    if (lobbyState !== LobbyJoinState.READY_TO_JOIN) {
      if (verbose) console.log('Lobby is not ready to join', lobbyState)
      return
    }

    // require all args
    if (!room || !gameId || !gameName || !url) {
      if (verbose) console.log('Lobby args are incomplete')
      return
    }

    if (verbose) console.log('running hook', room, gameId, gameName, url)

    // check for a free slot
    const freeSlotId = room.players.find((p) => !p.name)?.id
    if (verbose) console.log(`Attempting to claim slot ${freeSlotId}`)

    if (typeof freeSlotId === 'undefined') {
      setError('Server full')
      setLobbyState(LobbyJoinState.ERROR)
      return
    }

    setLobbyState(LobbyJoinState.JOINING)

    // join the game
    ky.post(`${url}/games/${gameName}/${gameId}/join`, {
      json: {
        playerID: freeSlotId,
        playerName: `Player ${freeSlotId}`,
      },
    })
      .json()
      .then(({ playerCredentials }) => {
        if (!playerCredentials) {
          throw new Error('No player credentials returned, join failed')
        }

        // on success, store creds in the server
        storePlayerCredentials(gameId, freeSlotId, playerCredentials)
        setSlot(freeSlotId)
        setLobbyState(LobbyJoinState.JOINED)
      })
      // start polling the server
      .then(() => setPollInterval(5000))
      .catch((err) => {
        console.error(err)
        setLobbyState(LobbyJoinState.ERROR)
        setError(`Error joining game - ${err}`)
      })
  }, [url, gameName, gameId, room, lobbyState, setSlot, verbose])

  // join on load
  useEffect(() => {
    refreshRoom().catch(console.error)
  }, [refreshRoom])

  return {
    error,

    slot,
    room,
    lobbyState,
    refreshRoom,

    clearPollInterval,
    setPollInterval,
  }
}

export default useGameLobby
