import * as React from 'react'
import Link from 'next/link'
import { LD46_GAME_NAME } from './ld46_constants'

const DemoGameRules = () => {
  return (
    <div className="m-4 w-1/2">
      <h2>{LD46_GAME_NAME} Game Rules</h2>
      <p className="mt-4  font-bold"></p>

      <p className="mt-4"></p>
      <Link href="/">
        <a>Back to game list</a>
      </Link>
    </div>
  )
}

export default DemoGameRules
