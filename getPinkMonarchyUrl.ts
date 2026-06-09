import {Chess} from 'chess.js'

const getPinkMonarchyUrl = (line: string) => {
  const columns = line.split(',')
  const [, fen, moves] = columns
  const gameUrl = columns[8] // Lichess puzzle CSV: GameUrl column
  const gameId = gameUrl?.match(/lichess\.org\/(\w+)/)?.[1] ?? null
  const chess = new Chess(fen)
  const firstMove = moves.split(' ')[0]
  chess.move(firstMove)
  const newFen = chess.fen()
  const color = newFen.split(' ')[1] === 'w' ? 'white' : 'black'

  return {
    fen: newFen,
    color,
    gameId,
    url: `https://lichess1.org/export/fen.gif?fen=${encodeURIComponent(
      newFen,
    )}&theme=pink&piece=monarchy&color=${color}&lastMove=${firstMove}`,
  }
}

export default getPinkMonarchyUrl
