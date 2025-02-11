import {Chess} from 'chess.js'

const getMoves = (fen: string, response: string) => {
  const chess = new Chess(fen)

  // Remove text within parentheses, including the parentheses themselves
  const cleanedResponse = response.replace(/\(.*?\)/g, '')

  // Split on commas, periods, and whitespace
  const words = cleanedResponse.split(/[,\.\s]+/)

  const moves = []

  while (words.length) {
    const word = words.shift()

    if (word) {
      // Always true
      try {
        // If it is a move, make it
        chess.move(word)
        moves.push(word)
      } catch {
        // Do nothing
      }
    }
  }

  return moves
}

export default getMoves
