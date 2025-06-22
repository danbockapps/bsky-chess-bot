// deluxePost.ts
// Post posts or threads with mentions

import {AppBskyFeedPost, AppBskyRichtextFacet, AtpAgent} from '@atproto/api'
import {ReplyRef} from '@atproto/api/dist/client/types/app/bsky/feed/post'
import getAgent from './getAgent'
import {deepPrint} from './utils'

export const deluxePost = async (posts: string[]) => {
  if (posts.length === 0) return

  const root = await postWithAutotag(posts[0])
  let parent = root

  for (const post of posts.slice(1)) {
    parent = await postWithAutotag(post, {root, parent})
  }
}

const postWithAutotag = async (text: string, reply?: ReplyRef) => {
  const facets = await getFacets(text)

  const post: AppBskyFeedPost.Record = {
    text,
    facets,
    reply,
    langs: ['en'],
    createdAt: new Date().toISOString(),
  }

  deepPrint(post)
  const agent = await getAgent()
  const result = await agent.post(post)
  deepPrint(result)
  return result
}

const getFacets = async (text: string): Promise<AppBskyRichtextFacet.Main[]> => {
  console.time('getFacets')
  const tags = text.match(/@[A-Za-z0-9.]+/g)?.map((m) => m.replace(/\.$/, ''))
  if (!tags) return []
  const agent = new AtpAgent({service: 'https://bsky.social'})
  const results: {handle: string; did: string}[] = []

  console.log('tags', tags)

  for (const tag of tags) {
    console.log('tag', tag)
    const handle = tag.slice(1)
    const {data} = await agent.resolveHandle({handle})
    console.timeLog('getFacets', 'Resolved handle', handle)
    if (data) results.push({handle, did: data.did})
  }

  console.timeEnd('getFacets')

  return results.map((result) => ({
    index: {
      byteStart: Buffer.from(text).indexOf(result.handle) - 1,
      byteEnd: Buffer.from(text).indexOf(result.handle) + result.handle.length,
    },
    features: [{$type: 'app.bsky.richtext.facet#mention', did: result.did}],
  }))
}
