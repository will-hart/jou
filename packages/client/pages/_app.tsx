import * as React from 'react'
import { AppProps } from 'next/app'

import SharedLayout from '../layout/SharedLayout'

import '../styles/tailwind.css'

const GameServerApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SharedLayout>
      <Component {...pageProps} />
    </SharedLayout>
  )
}

export default GameServerApp
