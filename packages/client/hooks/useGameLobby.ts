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
  const [pollInterval, setPollInterval] = useState<number>(undefined)
  const stopPolling = () => setPollInterval(undefined)

  // if a slot ID is provided, we have already joined. Go straight to JOINED state
  useEffect(() => {
    if (claimedSlot === null) {
      // no slot has been claimed - attempt to join
      if (verbose)
        console.log('CLAIM - no slot claimed, setting init', claimedSlot)
      setLobbyState(LobbyJoinState.INIT)
    } else if (typeof claimedSlot === 'undefined') {
      // waiting for the join page to load properly
      if (verbose)
        console.log('CLAIM - claimedSlot undefined, preparing', claimedSlot)
      setLobbyState(LobbyJoinState.PREPARING)
    } else {
      // a slot has already been claimed!
      if (verbose)
        console.log('CLAIM - slot claimed, skipping to joined', claimedSlot)
      setSlot(claimedSlot)
      setLobbyState(LobbyJoinState.JOINED)
      setPollInterval(5000)
    }
  }, [claimedSlot, verbose])

  const refreshRoom = useCallback(async (): Promise<void> => {
    // items are not populated
    if (!url || !gameName || !gameId) {
      if (verbose) console.log('REFRESH_ROOM - incomplete args, skipping')
      return
    }

    // if we are still "preparing" the join page (i.e. recovering from SSR)
    // or the lobby is not in the correct state, abort refreshRoom request
    if (
      !lobbyState ||
      ![LobbyJoinState.INIT, LobbyJoinState.JOINED].includes(lobbyState)
    ) {
      if (verbose)
        console.log(
          'REFRESH_ROOM - incompatible lobby state, skipping',
          lobbyState
        )
      return
    }

    if (verbose) console.log('REFRESH_ROOM - refreshing', lobbyState)
    const room: Room | null = await ky
      .get(`${url}/games/${gameName}/${gameId}`)
      .json<Room>()
      .catch((err) => {
        console.warn('REFRESH ERROR', err)
        setError(
          `Error refreshing room - ${
            err.response.status === 404
              ? 'room not found'
              : `Code ${err.response.status}`
          }`
        )
        return null
      })

    setRoom(room)

    if (lobbyState === LobbyJoinState.INIT) {
      setLobbyState(LobbyJoinState.READY_TO_JOIN)
    }
  }, [lobbyState, url, gameName, gameId, verbose])

  // set up some interval hooks for tracking the game state (to see when all players have joined)
  useInterval(() => {
    refreshRoom().catch(console.error)
  }, pollInterval)

  // when the room is returned and we are ready to join
  // find an available free slot and attempt to join it
  useEffect(() => {
    // should be in idle state before requesting
    if (lobbyState !== LobbyJoinState.READY_TO_JOIN) {
      if (verbose)
        console.log(
          'JOIN - Lobby is not in the correct state to attempt join',
          lobbyState
        )
      return
    }

    // require all args
    if (!room || !gameId || !gameName || !url) {
      if (verbose) console.log('JOIN - Lobby args are incomplete')
      return
    }

    if (verbose) console.log('JOIN - joining', room, gameId, gameName, url)

    // check for a free slot
    const freeSlotId = room.players.find((p) => !p.name)?.id
    if (verbose) console.log(`JOIN - Attempting to claim slot ${freeSlotId}`)

    if (typeof freeSlotId === 'undefined') {
      setError('Server full')
      setLobbyState(LobbyJoinState.ERROR)
      return
    }

    setLobbyState(LobbyJoinState.JOINING)

    // join the game
    ky.post(`${url}/games/${gameName}/${gameId}/join`, {
      retry: 0,
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
        setPollInterval(5000)
        if (verbose) console.log('JOIN - claimed slot', freeSlotId)
      })
      .catch((err) => {
        console.error('JOIN ERROR', err)
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

    stopPolling,
    setPollInterval,
  }
}

export default useGameLobby
