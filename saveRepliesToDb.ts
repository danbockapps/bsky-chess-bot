import {isThreadViewPost} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {and, eq, lt, sql} from 'drizzle-orm'
import {db} from './db'
import {postsTable} from './db/schema'
import getAgent from './getAgent'
import getMoves from './getMoves'
import getRandomHappyEmoji from './getRandomHappyEmoji'
import matesIn2 from './matesIn2'
import reply from './reply'
import {deepPrint} from './utils'

const saveRepliesToDb = async () => {
  console.log()
  console.log('_______________saveRepliesToDb.ts_______________')
  console.log(new Date().toISOString())
  console.time('saveRepliesToDb')

  const posts = await db
    .select({id: postsTable.id, uri: postsTable.uri, cid: postsTable.cid, fen: postsTable.fen})
    .from(postsTable)
    .where(
      and(
        lt(postsTable.createdAt, sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-23 hours')`),
        eq(postsTable.username, process.env.BLUESKY_USERNAME!),
        eq(postsTable.processed, 0),
      ),
    )

  console.timeLog('saveRepliesToDb', 'Got posts from the database')

  console.log({posts})

  const agent = await getAgent()

  for (const post of posts) {
    console.log('Processing post', post.id)
    await db.update(postsTable).set({processed: 1}).where(eq(postsTable.id, post.id)).execute()

    const response = await agent.getPostThread({uri: post.uri})
    console.log('Replies:')
    deepPrint(response.data.thread.replies)

    const {thread} = response.data
    const {fen} = post

    if (isThreadViewPost(thread) && thread.replies && fen) {
      console.log('Inserting replies')

      const values = thread.replies.filter(isThreadViewPost).map((r) => {
        console.log('Inserting reply', r.post.uri)

        // This type has record: {} for some reason
        // node_modules/@atproto/api/src/client/types/app/bsky/feed/defs.ts
        const record: {createdAt: string; text: string} = r.post.record as any

        const correct = matesIn2(fen, record.text) ? 1 : 0

        console.log('matesIn2')
        console.log('matesIn2 fen', fen)
        console.log('matesIn2 text', record.text)
        console.log('matesIn2 correct', correct)

        return {
          username: r.post.author.handle,
          createdAt: record.createdAt,
          text: record.text,
          correct,
          uri: r.post.uri,
          cid: r.post.cid,
          reply_to_uri: post.uri,
          reply_to_cid: post.cid,
        }
      })

      if (values.length > 0) {
        await db.insert(postsTable).values(values).execute()

        for (const value of values) {
          const replyRef = {
            root: {uri: value.reply_to_uri, cid: value.reply_to_cid},
            parent: {uri: value.uri, cid: value.cid},
          }

          if (value.correct) {
            console.timeLog('saveRepliesToDb', 'Replying to', value.username)
            await reply(replyRef, `Correct! ${getRandomHappyEmoji()}`)
          } else if (getMoves(fen, value.text).length > 0) {
            console.timeLog('saveRepliesToDb', 'Replying to', value.username)
            await reply(replyRef, 'To earn a point, provide a full line (3 ply) ending with mate.')
          }
          await delay(5000) // Wait for 5 seconds before processing the next value
        }

        // If utc time is a monday between 18:00 and 23:59, post standings
        const utc = new Date().toUTCString()
        const day = utc.slice(0, 3)
        const hour = Number(utc.slice(17, 19))
        if (day === 'Mon' && hour >= 18 && hour < 24) {
          console.timeLog('saveRepliesToDb', 'Posting standings')
          // await postStandings()
        } else {
          console.timeLog('saveRepliesToDb', 'Not posting standings')
        }
      }
    }
  }
  console.timeEnd('saveRepliesToDb')
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

saveRepliesToDb()
