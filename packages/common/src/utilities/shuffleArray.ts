const shuffleArray = <T>(items: T[]): T[] => {
  let currentIndex = items.length
  let temporaryValue: T
  let randomIndex: number

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = items[currentIndex]
    items[currentIndex] = items[randomIndex]
    items[randomIndex] = temporaryValue
  }

  return items
}

export default shuffleArray
