import { ICardDefinition } from '@jou/common'

export const getDummyCard = (
  name: string,
  image = '/cards/back.png',
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
