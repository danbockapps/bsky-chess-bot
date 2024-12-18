import * as fs from 'fs'
import * as readline from 'readline'

const inputFile = 'mateIn2.csv'

async function filterHighRatingLines(filePath: string, minRating: number) {
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const columns = line.split(',')
    const rating = Number(columns[3])

    if (rating > minRating) {
      console.log(line)
    }
  }
}

filterHighRatingLines(inputFile, 2200).catch(console.error)
