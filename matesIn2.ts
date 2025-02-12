import {Chess} from 'chess.js'
import getMoves from './getMoves'

const matesIn2 = (fen: string, response: string) => {
  const moves = getMoves(fen, response.replaceAll('++', ''))

  if (moves.length !== 3) return false

  const chess = new Chess(fen)

  for (const move of moves) {
    chess.move(move)
  }

  return chess.isCheckmate()
}

export default matesIn2
