import ky from 'ky-universal'
import { useState, useEffect, useCallback } from 'react'
import { storePlayerCredentials } from '../utilities'

export interface Player {
  id: number
  name?: string
}

export interface Room {
  gameID: string
  players: Player[]
}

export interface GameList {
  rooms: Room[]
}

const useLobby = (
  url: string,
  gameName: string,
  push: (url: string, as?: string, options?: {}) => Promise<boolean>
) => {
  const [roomList, setRoomList] = useState<GameList>()
  const [loading, setLoading] = useState<boolean>(true)

  const refreshRoomList = useCallback(async (): Promise<void> => {
    setLoading(true)
    const gameList: GameList = await ky.get(`${url}/games/${gameName}`).json()
    console.log(gameList)
    setRoomList(gameList)
    setLoading(false)
  }, [url, gameName])

  const createAndJoinGame = useCallback(async (): Promise<void> => {
    setLoading(true)

    const { gameID } = await ky
      .post(`${url}/games/${gameName}/create`, {
        json: { numPlayers: 2 },
      })
      .json()

    push(`/game/${gameName}/join?roomId=${gameID}`).catch(console.error)
  }, [url, gameName, setLoading, push])

  useEffect(() => {
    refreshRoomList().catch(console.warn)
  }, [url, gameName, refreshRoomList])

  return {
    createAndJoinGame,
    roomList,
    loading,
    refreshGameList: refreshRoomList,
  }
}

export default useLobby
