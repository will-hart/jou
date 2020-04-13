import * as React from 'react'
import Link from 'next/link'

import Card from '../components/Card'

interface GameOverProps {
  winner: string
  score: string
  lobbyLink: string
}

const GameOver = ({ winner, score, lobbyLink }: GameOverProps) => {
  return (
    <Card>
      <h3>GAME COMPLETE</h3>
      <p>
        Winner: {winner}, score {score}
      </p>
      <p>
        <Link href={lobbyLink}>
          <a>Return to the lobby</a>
        </Link>
      </p>
    </Card>
  )
}

export default GameOver
