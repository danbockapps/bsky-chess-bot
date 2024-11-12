import {AtpAgent} from '@atproto/api'
import {configDotenv} from 'dotenv'
import getPinkMonarchyUrl from './getPinkMonarchyUrl'
import getRandomLine from './getRandomLine'
import {deepPrint} from './utils'

console.time('puzzle')
configDotenv()
const filePath = process.argv[2]

if (!filePath) {
  console.error('Please provide a file path as an argument')
  process.exit(1)
}

getRandomLine(filePath)
  .then(async (line) => {
    console.timeLog('puzzle', 'Got random line')
    const {fen, color, url} = getPinkMonarchyUrl(line)
    const response = await fetch(url)
    console.timeLog('puzzle', 'Got image')
    const blob = await response.blob()
    console.timeLog('puzzle', 'Got blob')

    const agent = new AtpAgent({service: 'https://bsky.social'})

    await agent.login({
      identifier: process.env.BLUESKY_USERNAME!,
      password: process.env.BLUESKY_PASSWORD!,
    })

    console.timeLog('puzzle', 'Logged in')
    const {data} = await agent.uploadBlob(blob)
    console.timeLog('puzzle', 'Uploaded blob')

    console.log('blob')
    deepPrint(data.blob)

    const post = {
      text: `${color.charAt(0).toUpperCase() + color.slice(1)} to move and mate in 2.`,
      langs: ['en'],
      createdAt: new Date().toISOString(),
      embed: {
        $type: 'app.bsky.embed.images',
        images: [{alt: fen, image: data.blob, aspectRatio: {width: 720, height: 720}}],
      },
    }

    deepPrint(post)

    const result = await agent.post(post)

    console.timeLog('puzzle', 'Posted')
    deepPrint(result)
  })
  .catch(console.error)
  .finally(() => console.timeEnd('puzzle'))
