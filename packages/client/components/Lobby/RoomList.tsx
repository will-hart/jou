import * as React from 'react'
import Link from 'next/link'
import { Room } from '../../hooks/useLobby'
import Spinner from '../Spinner'

interface RoomListProps {
  loading: boolean
  rooms?: Room[]
}

const RoomList = ({ loading, rooms }: RoomListProps) => {
  return (
    <div className="flex flex-col">
      <h3>Rooms</h3>

      <table>
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Players</th>
            <th>Join</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3}>
                <Spinner small />
              </td>
            </tr>
          ) : (
            rooms.map((room) => (
              <tr key={room.gameID}>
                <td>{room.gameID}</td>
                <td>
                  {room.players.filter((p) => !!p.name).length} /{' '}
                  {room.players.length}
                </td>
                <td>JOIN</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RoomList
