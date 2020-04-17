import * as React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { Card } from '../../../components'
import { validateRouterArg } from '../../../utilities'

const DemogameRules = dynamic(() =>
  import('../../../components/DemoGame/Rules')
)

const LobbyPage = () => {
  const { query } = useRouter()

  const gameId = validateRouterArg(query.gameId)

  return (
    <Card>
      <Head>
        <title>Game Lobby</title>
      </Head>

      {gameId === 'demo' && <DemogameRules />}
    </Card>
  )
}

export default LobbyPage
