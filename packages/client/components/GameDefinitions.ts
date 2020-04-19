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
    minPlayers: 1,
    maxPlayers: 4,
  },
}

export default GAME_SETTINGS
