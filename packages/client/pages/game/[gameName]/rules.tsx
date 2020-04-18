import * as React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Card, Alert, AlertType } from '../../../components'
import { validateRouterArg } from '../../../utilities'
import { LD46_GAME_ID } from '../../../components/LD46/ld46_constants'

const DemogameRules = dynamic(() =>
  import('../../../components/DemoGame/Rules')
)

const LD46GameRules = dynamic(() => import('../../../components/LD46/Rules'))

const renderRules = (gameId: string) => {
  switch (gameId) {
    case 'demo':
      return <DemogameRules />
    case LD46_GAME_ID:
      return <LD46GameRules />
    default:
      return (
        <Alert type={AlertType.Warning}>
          <strong>Unable to display rules</strong>: Unknown game
        </Alert>
      )
  }
}

const LobbyPage = () => {
  const { query } = useRouter()

  const gameName = validateRouterArg(query.gameName)

  return (
    <Card>
      <Head>
        <title>Game Lobby</title>
      </Head>

      {renderRules(gameName)}
    </Card>
  )
}

export default LobbyPage
