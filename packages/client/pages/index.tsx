import * as React from 'react'
// import { useRouter } from 'next/router'
import Head from 'next/head'

import { Card } from '../components'
import GameBrowser from '../components/Lobby/GameBrowser'

// import { validateRouterArg } from '../utilities'

const GameHomePage = () => {
  return (
    <Card>
      <Head>
        <title>jou - Available Games</title>
      </Head>

      <GameBrowser />
    </Card>
  )
}

export default GameHomePage
