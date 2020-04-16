import * as React from 'react'
import Link from 'next/link'

const GameBrowser = () => {
  return (
    <div className="flex flex-col">
      <h2>Games</h2>

      <div className="flex flex-col md:flex-row flex-wrap justify-around">
        <div className="w-full md:w-1/4 rounded overflow-hidden shadow-lg bg-white border border-gray-200">
          <div className="flex w-full justify-center items-center h-48 bg-gray-600">
            <div className="text-white text-4xl">Demo Game</div>
          </div>
          <div className="flex flex-row justify-between p-4">
            <Link href="/game/demo/rules">
              <a className="text-center flex-grow">Rules</a>
            </Link>
            <div className="border-r border-gray-200"> </div>
            <div className="text-center flex-grow text-gray-300">vs AI</div>
            <div className="border-r border-gray-200"> </div>
            <Link href="/lobby/demo">
              <a className="text-center flex-grow">vs People</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBrowser
