// Function to get Bluesky posts from the accounts listed in primary_dids.txt
import {AppBskyFeedGetAuthorFeed} from '@atproto/api'
import axios from 'axios'
import {configDotenv} from 'dotenv'
import * as fs from 'fs'
import OpenAI from 'openai'
import * as readline from 'readline'
import {deepPrint} from '../utils'
import {z} from 'zod'

configDotenv()
const inputFile = 'ai/primary_dids.txt'

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

const prompt = `
Each of the posts below has three fields:

1. text: the text of the post
2. likeCount: the number of likes the post got
3. hasImage: whether the post has an image. It may be hard to understand a post with an image,
since you can't see it.

Write a post that will get a lot of likes. It must be 300 characters or less and state a strong
opinion. It should be on a lighthearted topic but you should come across as slightly angry. Don't
use hashtags.

`

const prompt2 =
  'Pick one of the posts below and write a post that disagrees, in 300 characters or less. Do not quote the original post or refer to it directly.'

const ThreeTasks = z.object({joke: z.string(), post: z.string(), summary: z.string()})

getChessPosts()
  .then(async (posts) => {
    const now = new Date().getTime()
    const inputPosts = posts
      .filter((p) => (now - new Date(p.post.record.createdAt).getTime()) / (1000 * 60 * 60) < 48)
      .map((p) => ({
        text: p.post.record.text,
        createdAt: p.post.record.createdAt,
        likeCount: p.post.likeCount,
        hasImage: p.post.record.embed?.$type === 'app.bsky.embed.images',
      }))

    console.log('Using', inputPosts.length, 'posts')

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY!})

    console.log('Querying OpenAI...')

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{role: 'system', content: prompt + JSON.stringify(inputPosts)}],
      // response_format: zodResponseFormat(ThreeTasks, 'three_tasks'),
    })

    deepPrint(response)
  })
  .catch((error) => {
    console.error('Error fetching posts:', error)
  })
