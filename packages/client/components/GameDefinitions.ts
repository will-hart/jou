interface IGameSettings {
  [key: string]: {
    minPlayers: number
    maxPlayers: number
  }
}

const GAME_SETTINGS: IGameSettings = {
  demo: {
    minPlayers: 2,
    maxPlayers: 2,
  },
  // eslint-disable-next-line @typescript-eslint/camelcase
  by_the_sword: {
    minPlayers: 2, // TODO set correct numbers when https://github.com/nicolodavis/boardgame.io/issues/628 is resolved
    maxPlayers: 2,
  },
}

export default GAME_SETTINGS
