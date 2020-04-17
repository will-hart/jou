import { ICardDefinition } from '@jou/common'
import { DEMO_BASE_CARD_PATH } from './constants'

export const getDummyCard = (
  name: string,
  image = `${DEMO_BASE_CARD_PATH}/back.png`,
  key = '__deck'
): ICardDefinition => ({
  affinity: '',
  effects: [],
  id: `${key}::${name}`,
  imagePath: image,
})

export const getHiddenCard = (image?: string): ICardDefinition => ({
  affinity: '',
  effects: [],
  id: `__hiddencard::${name}`,
  imagePath: image,
})

export const validateRouterArg = (arg: string | string[]): string | null => {
  if (!arg) return null
  return Array.isArray(arg) ? arg[0] : arg
}

export const getRangeArray = (n: number): number[] => {
  const arr = Array(n).fill(0)

  for (let i = 0; i < n; ++i) {
    arr[i] = i
  }

  return arr
}

const JOULS_CREDS_KEY = 'jou_credentials'

export const storePlayerCredentials = (
  roomId: string,
  slotId: number,
  credential: string
) => {
  if (typeof localStorage === 'undefined') return

  localStorage.setItem(
    JOULS_CREDS_KEY,
    JSON.stringify({
      ...JSON.parse(localStorage.getItem(JOULS_CREDS_KEY)),
      [roomId]: { slotId, credential },
    })
  )
}

export const getPlayerCredentialsForRoom = (
  roomId: string
): { slotId: number; credential: string } | undefined => {
  if (typeof localStorage === 'undefined') return null
  if (roomId === null) return null

  const creds = JSON.parse(localStorage.getItem(JOULS_CREDS_KEY))
  return creds ? creds[roomId] : null
}
