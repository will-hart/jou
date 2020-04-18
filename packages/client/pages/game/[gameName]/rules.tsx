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

  const gameName = validateRouterArg(query.gameName)

  return (
    <Card>
      <Head>
        <title>Game Lobby</title>
      </Head>

      {gameName === 'demo' && <DemogameRules />}
    </Card>
  )
}

export default LobbyPage
