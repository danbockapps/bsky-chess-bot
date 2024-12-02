// Function to get Bluesky posts from the accounts listed in primary_dids.txt
import {AppBskyFeedGetAuthorFeed, AtpAgent} from '@atproto/api'
import axios from 'axios'
import * as fs from 'fs'
import * as readline from 'readline'

const inputFile = 'primary_dids.txt'

async function readDIDsFromFile(filePath: string): Promise<string[]> {
  const dids: string[] = []
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  for await (const line of rl) {
    const did = line.trim()
    if (did) {
      dids.push(did)
    }
  }

  return dids
}
async function fetchPosts(actor: string) {
  try {
    console.log('start fetching posts for DID', actor)

    const response = await axios.get<AppBskyFeedGetAuthorFeed.OutputSchema>(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed`,
      {params: {actor, limit: 15}},
    )
    console.log('fetched posts for DID', actor)
    return response.data.feed
  } catch (error) {
    console.error(`Failed to fetch posts for DID ${actor}:`, error)
    return []
  }
}

async function getChessPosts() {
  const dids = await readDIDsFromFile(inputFile)
  const allPosts: any[] = []

  for (const did of dids) {
    const posts = await fetchPosts(did)
    allPosts.push(...posts)
  }

  return allPosts
}

getChessPosts()
  .then((posts) => {
    posts[0].po
    const now = new Date().getTime()
    console.log(
      posts
        .filter((p) => (now - new Date(p.post.record.createdAt).getTime()) / (1000 * 60 * 60) < 48)
        .map((p) => ({
          text: p.post.record.text,
          createdAt: p.post.record.createdAt,
          likeCount: p.post.likeCount,
          hasImage: p.post.record.embed?.$type === 'app.bsky.embed.images',
        })),
    )
  })
  .catch((error) => {
    console.error('Error fetching posts:', error)
  })
