const getPinkMonarchyUrl = (line: string) => {
  const [, fen] = line.split(',')
  const color = fen.split(' ')[1] === 'w' ? 'white' : 'black'
  return {
    fen,
    color,
    url: `https://lichess1.org/export/fen.gif?fen=${encodeURIComponent(
      fen,
    )}&theme=pink&piece=monarchy&color=${color}`,
  }
}

export default getPinkMonarchyUrl
