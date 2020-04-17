import * as React from 'react'
import Link from 'next/link'

const DemoGameRules = () => {
  return (
    <div className="m-4 w-1/2">
      <h2>Demo Game Rules</h2>
      <p className="mt-4  font-bold">
        The demo game is a very basic game to demonstrate custom game modes in
        jou. The source code be found in the <code>@jou/demo</code> package. The
        objective of the game is to reach 30 points before your opponent by
        playing cards of matching colours. The more cards of matching colour,
        the more points are awarded.
      </p>

      <p className="mt-4">
        To start, each player should click on the draw deck to draw a card of
        five hands. They then take it in turns to play a card until each player
        has played 3 cards from their hand. If a card is played which matches
        the colour of a card already played by the opponent, then both cards are
        discarded and no points are awared for those cards.
      </p>

      <p className="my-4">
        Points are scored by playing cards from your hand with matching colours.
        The more cards that match the higher the score (the exact equation is
        2^n-1, where n is the number of cards of the same colour).
      </p>

      <Link href="/">
        <a>Back to game list</a>
      </Link>
    </div>
  )
}

export default DemoGameRules
