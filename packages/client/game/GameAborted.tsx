import * as React from 'react'
import Link from 'next/link'

import Card from '../components/Card'

interface GameAbortedProps {
  lobbyLink: string
}

const GameAborted = ({ lobbyLink }: GameAbortedProps) => {
  return (
    <Card>
      <h3>Game Aborted</h3>
      <p>
        The other player has left the game. Please{' '}
        <Link href={lobbyLink}>
          <a>return to the lobby.</a>
        </Link>
      </p>
    </Card>
  )
}

export default GameAborted
