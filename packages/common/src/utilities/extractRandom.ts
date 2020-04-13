const extractRandom = <T>(items: T[], remove = true): [T, T[]] => {
  const idx = Math.floor(Math.random() * items.length)
  const item = items[idx]
  return [
    item,
    remove ? [...items.slice(1, idx), ...items.slice(idx + 1)] : items,
  ]
}

export default extractRandom
