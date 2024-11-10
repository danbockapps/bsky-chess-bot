import {AtpAgent} from '@atproto/api'
import {configDotenv} from 'dotenv'

interface Record {
  createdAt: string
  text: string
  replyCount: number
  repostCount: number
  likeCount: number
  quoteCount: number
}

configDotenv()
const agent = new AtpAgent({service: 'https://bsky.social'})

const run = async () => {
  console.time('run')
  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password: process.env.BLUESKY_PASSWORD!,
  })

  console.timeLog('run', 'logged in')

  const {
    data: {feed},
  } = await agent.app.bsky.feed.getFeed(
    {feed: process.env.CHESSFEED_URL!, limit: 3},
    {headers: {'Accept-Language': 'en'}},
  )

  console.timeEnd('run')

  const processedFeed = feed.map((item) => {
    const {record, replyCount, repostCount, likeCount, quoteCount} = item.post
    const {createdAt, text} = record as Record
    return {createdAt, text, replyCount, repostCount, likeCount, quoteCount}
  })

  console.log(processedFeed)
}

run()
