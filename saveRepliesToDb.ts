import {isThreadViewPost} from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import {and, eq, lt, sql} from 'drizzle-orm'
import {db} from './db'
import {postsTable} from './db/schema'
import getAgent from './getAgent'
import matesIn2 from './matesIn2'
import {deepPrint} from './utils'

const saveRepliesToDb = async () => {
  const posts = await db
    .select({id: postsTable.id, uri: postsTable.uri, cid: postsTable.cid, fen: postsTable.fen})
    .from(postsTable)
    .where(
      and(
        lt(postsTable.createdAt, sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-11 hours')`),
        eq(postsTable.username, 'janechess.bsky.social'),
        eq(postsTable.processed, 0),
      ),
    )

  console.log({posts})

  const agent = await getAgent()

  posts.forEach(async (post) => {
    console.log('Processing post', post.id)
    const response = await agent.getPostThread({uri: post.uri})
    deepPrint(response.data.thread.replies)

    const {thread} = response.data
    const {fen} = post

    if (isThreadViewPost(thread) && thread.replies && fen) {
      console.log('Inserting replies')

      await db
        .insert(postsTable)
        .values(
          thread.replies.filter(isThreadViewPost).map((r) => {
            console.log('Inserting reply', r.post.uri)

            // This type has record: {} for some reason
            // node_modules/@atproto/api/src/client/types/app/bsky/feed/defs.ts
            const record: {createdAt: string; text: string} = r.post.record as any

            return {
              username: r.post.author.handle,
              createdAt: record.createdAt,
              text: record.text,
              correct: matesIn2(fen, record.text) ? 1 : 0,
              uri: r.post.uri,
              cid: r.post.cid,
              reply_to_uri: post.uri,
              reply_to_cid: post.cid,
            }
          }),
        )
        .execute()
    }
  })
}

saveRepliesToDb()
