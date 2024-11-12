import {exec} from 'child_process'

const filePath = process.argv[2]

if (!filePath) {
  console.error('Please provide a file path as an argument')
  process.exit(1)
}

const getRandomLine = (filePath: string) =>
  new Promise((resolve, reject) => {
    exec(`shuf -n 1 ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`)
      } else {
        resolve(stdout.trim())
      }
    })
  })

getRandomLine(filePath).then(console.log).catch(console.error)
