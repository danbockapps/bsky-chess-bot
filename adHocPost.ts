import {AppBskyFeedPost, AtpAgent} from '@atproto/api'
import {configDotenv} from 'dotenv'
import {deepPrint} from './utils'

const text =
  'Fischer defeats Spassky! I predict he will defend his world championship against Anatoly Karpov in 1975. #chessfeed'

const createdAt = new Date('1972-09-01T06:41:00').toISOString()

console.time('adHocPost')
configDotenv()

const sendPost = async () => {
  const agent = new AtpAgent({service: 'https://bsky.social'})

  await agent.login({
    identifier: process.env.AD_HOC_USERNAME!,
    password: process.env.AD_HOC_PASSWORD!,
  })

  console.timeLog('adHocPost', 'Logged in')

  const post: Partial<AppBskyFeedPost.Record> & Omit<AppBskyFeedPost.Record, 'createdAt'> = {
    text,
    langs: ['en'],
    createdAt,
  }

  const result = await agent.post(post)
  console.timeLog('adHocPost', 'Posted')
  deepPrint(result)
}

sendPost()
