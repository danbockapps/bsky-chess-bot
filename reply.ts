import {AppBskyFeedPost} from '@atproto/api'
import {ReplyRef} from '@atproto/api/dist/client/types/app/bsky/feed/post'
import getAgent from './getAgent'
import {deepPrint} from './utils'

const reply = async (reply: ReplyRef, text: string) => {
  console.log('Sending reply', text)
  const agent = await getAgent()
  const post: AppBskyFeedPost.Record = {text, createdAt: new Date().toISOString(), reply}
  const result = await agent.post(post)
  deepPrint(post)
  deepPrint(result)
}

export default reply
