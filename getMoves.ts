import {Chess} from 'chess.js'

const getMoves = (fen: string, response: string) => {
  const chess = new Chess(fen)

  // Split on either a space or a number followed by a period
  const words = response.split(/(?:\s+|\d+\.)/)

  const moves = []

  while (words.length) {
    const word = words.shift()

    if (word) {
      const legalMoves = chess.moves().map(getPlainMove)

      if (legalMoves.includes(getPlainMove(word))) {
        chess.move(word)
        moves.push(word)
      }
    }
  }

  return moves
}

/**
 * Removes the last character if it is + or #
 * @param str - The input string
 * @returns The modified string
 */
const getPlainMove = (str: string) =>
  str.endsWith('+') || str.endsWith('#') ? str.slice(0, -1) : str

export default getMoves
