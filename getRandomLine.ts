import {exec} from 'child_process'

const getRandomLine = (filePath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(`shuf -n 1 ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`)
      } else {
        resolve(stdout.trim())
      }
    })
  })

export default getRandomLine
