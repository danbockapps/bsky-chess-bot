import {db} from './src/db'
import {postsTable} from './src/db/schema'

db.insert(postsTable)
  .values({
    username: 'boldmovebydan.bsky.social',
    date: new Date().toISOString(),
    text: 'This is not a real post',
    uri: 'abc',
    cid: '123',
  })
  .execute()
