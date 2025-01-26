import {AppBskyFeedPost} from '@atproto/api'
import {configDotenv} from 'dotenv'
import {db} from './db'
import {postsTable} from './db/schema'
import getAgent from './getAgent'
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

    const agent = await getAgent()

    console.timeLog('puzzle', 'Logged in')
    const {data} = await agent.uploadBlob(blob)
    console.timeLog('puzzle', 'Uploaded blob')

    console.log('blob')
    deepPrint(data.blob)

    const post: AppBskyFeedPost.Record = {
      text: `${color.charAt(0).toUpperCase() + color.slice(1)} to move and mate in 2. #chess`,
      facets: [
        {
          index: {byteStart: 29, byteEnd: 35},
          features: [{$type: 'app.bsky.richtext.facet#tag', tag: 'chess'}],
        },
      ],
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

    db.insert(postsTable)
      .values({
        username: 'janechess.bsky.social',
        createdAt: post.createdAt,
        text: post.text,
        uri: result.uri,
        cid: result.cid,
        fen,
      })
      .execute()
  })
  .catch(console.error)
  .finally(() => console.timeEnd('puzzle'))
