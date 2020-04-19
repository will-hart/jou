import * as React from 'react'
import Link from 'next/link'
import { LD46_GAME_NAME } from './ld46_constants'

const DemoGameRules = () => {
  return (
    <>
      <img src="https://bythesword-cards.s3-ap-southeast-2.amazonaws.com/banner.png" />
      <div className="m-4 w-2/3 mx-auto">
        <h2>{LD46_GAME_NAME} Game Rules</h2>
        <Link href="/">
          <a>Back to game list</a>
        </Link>
        <p className="mt-4 italic">
          By the Sword is a (semi-)cooperative card game for 1-4 players. Guide
          your group of Gladiators through the arena in Ancient Rome. Work
          together to stay alive by inspiring the crowd and please the Emperor
          Caligula. Be careful, unless one player gets too popular and decides
          to take the glory for themself!
        </p>

        <p className="mt-4">
          <strong>Cards</strong>: There are three decks in the game:
          <ol className="list-disc pl-8">
            <li>
              <em>Action cards</em> are things that your gladiators can do
            </li>
            <li>
              <em>Character cards</em> are gladiators that can fight on your
              side
            </li>
            <li>
              <em>Creature cards</em> are the enemies your gladiators fight in
              the arena
            </li>
          </ol>
        </p>

        <p className="mt-4">
          <strong>Basic Gameplay</strong>: Players draft a pool of warriors,
          then &quot;purchase&quot; creatures to fight in the arena by playing
          action cards. Players aim to increase the <em>excitement</em> in the
          arena by playing specific cards and defeating creatures. Players each
          have their own popularity level and the arena also has a popularity
          level.
        </p>

        <p className="mt-4">
          <strong>Winning and losing</strong>: If the arena excitement level
          reaches 50, then the player&apos;s are pardoned by the Emperor and
          win. If one player is remaining, and their individual popularity is
          above 30, they win and the other players lose. If all players are
          eliminated before popularity reaches the correct level, they lose.
        </p>

        <p className="mt-4">
          <strong>Cards</strong>
          <img src="https://bythesword-cards.s3-ap-southeast-2.amazonaws.com/card_details.png" />
        </p>

        <p className="mt-4">
          <strong>Sequence of play</strong>: The game has the following turn
          sequence:
          <ol className="list-decimal pl-8">
            <li>Draft gladiators</li>
            <li>Draft monsters</li>
            <li>Draw action cards</li>
            <li>
              Loop until all drafted monsters are defeated:
              <ol className="list-decimal pl-8">
                <li>
                  Players take it in turn to play one action card per gladiator
                </li>
                <li>Combat is resolved, and defeated creatures are removed.</li>
              </ol>
            </li>
            <li>
              Once all monsters are defeated, check victory conditions and
              return to step 1
            </li>
          </ol>
        </p>
      </div>
    </>
  )
}

export default DemoGameRules
