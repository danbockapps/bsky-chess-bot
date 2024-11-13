import {Chess} from 'chess.js'

const getPinkMonarchyUrl = (line: string) => {
  const [, fen, moves] = line.split(',')
  const chess = new Chess(fen)
  chess.move(moves.split(' ')[0])
  const newFen = chess.fen()
  const color = newFen.split(' ')[1] === 'w' ? 'white' : 'black'

  return {
    fen,
    color,
    url: `https://lichess1.org/export/fen.gif?fen=${encodeURIComponent(
      newFen,
    )}&theme=pink&piece=monarchy&color=${color}`,
  }
}

export default getPinkMonarchyUrl
