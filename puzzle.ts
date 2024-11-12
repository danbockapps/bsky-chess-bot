import * as fs from 'fs'
import * as readline from 'readline'
import {exec} from 'child_process'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Please provide a file path as an argument')
  process.exit(1)
}

const getLineCount = (filePath: string): Promise<number> =>
  new Promise((resolve, reject) => {
    exec(`wc -l < ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`)
      } else {
        resolve(parseInt(stdout.trim(), 10))
      }
    })
  })

const readRandomLine = async () => {
  const numLines = await getLineCount(filePath)
  const randomLineNumber = Math.floor(Math.random() * numLines)

  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  let currentLine = 0
  for await (const line of rl) {
    console.log({currentLine, line})
    if (currentLine === randomLineNumber) {
      console.log('found line')
      return line
    }
    currentLine++
  }
}

readRandomLine().then(console.log).catch(console.error)
