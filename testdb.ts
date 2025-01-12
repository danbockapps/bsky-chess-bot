import {db} from './db'
import {postsTable} from './db/schema'

db.insert(postsTable)
  .values({
    username: 'boldmovebydan.bsky.social',
    createdAt: new Date().toISOString(),
    text: 'This is not a real post',
    uri: 'abc',
    cid: '123',
  })
  .execute()
