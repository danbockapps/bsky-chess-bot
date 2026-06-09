export const getGameDetails = async (gameId: string) => {
  console.log('_______________getGameDetails.ts_______________')
  console.log(new Date().toISOString())
  console.time('getGameDetails')

  const response = await fetch(`https://lichess.org/game/export/${gameId}`, {
    headers: {Accept: 'application/x-ndjson'},
  })

  if (!response.ok) {
    console.log(response)
    throw new Error(`Failed to fetch game details: ${response.statusText}`)
  }

  const data = await response.text()
  const lines = data.split('\n').filter((line) => line.trim() !== '')

  const gameDetails = JSON.parse(lines[0])
  console.timeEnd('getGameDetails')

  return {
    createdAt: gameDetails.createdAt as number,
    white: (gameDetails.players?.white?.user?.name as string) ?? 'Anonymous',
    black: (gameDetails.players?.black?.user?.name as string) ?? 'Anonymous',
  }
}

/**
 * Builds a sentence describing where a puzzle position came from, e.g.
 * "This position arose in abc vs def on Lichess on September 23, 2023."
 * Returns null if the game can't be fetched, so callers can skip it silently.
 */
export const getGameInfoMessage = async (gameId: string): Promise<string | null> => {
  try {
    const {createdAt, white, black} = await getGameDetails(gameId)
    const date = new Date(createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
    return `This position arose in ${white} vs ${black} on Lichess on ${date}.`
  } catch (error) {
    console.error('Error fetching game details:', error)
    return null
  }
}

export default getGameDetails
