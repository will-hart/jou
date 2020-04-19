import * as React from 'react'
import { useState } from 'react'
import { IDefaultGameState, IPlayerPublicData } from '@jou/common'

interface PlayerListProps {
  players: IDefaultGameState['public']
}

interface PlayerListItemProps {
  player: IPlayerPublicData
}

const PlayerListItem = ({ player }: PlayerListItemProps) => (
  <li className={player.isAway ? 'text-red-800' : 'text-gray-100'}>
    {player.name} {player.isAway && '(disconnected)'} {player.score} points
  </li>
)

const PlayerList = ({ players }: PlayerListProps) => {
  const [isHidden, setIsHidden] = useState(true)

  const hasMissing =
    players && Object.keys(players).some((k) => players[k].isAway)

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 bg-gray-700 select-none transition-all duration-500 ease-in-out ${
        isHidden ? 'h-12' : 'w-64 h-48'
      }`}
      onClick={() => setIsHidden((current) => !current)}
    >
      <div
        className={`font-bold text-gray-100 mb-3 text-center cursor-pointer p-3 ${
          hasMissing ? 'bg-red-800' : 'bg-gray-800'
        }`}
      >
        Players
      </div>
      {!isHidden && players && (
        <ul className="px-3">
          {Object.keys(players).map((key: string) => {
            const player: IPlayerPublicData = players[key]
            return (
              <PlayerListItem
                key={`player_list_${player.name}`}
                player={player}
              />
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default PlayerList
