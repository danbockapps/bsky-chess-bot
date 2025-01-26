import {Chess} from 'chess.js'

const getMoves = (fen: string, response: string) => {
  const chess = new Chess(fen)

  // Split on either a space or a number followed by a period
  const words = response.split(/(?:\s+|\d+\.)/)

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
