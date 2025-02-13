import {aliasedTable, eq, max} from 'drizzle-orm'
import {int, sqliteTable, sqliteView, text} from 'drizzle-orm/sqlite-core'

// Apply changes to the database: npx drizzle-kit push

export const postsTable = sqliteTable('posts', {
  id: int().primaryKey({autoIncrement: true}),
  username: text().notNull(),
  createdAt: text().notNull(),
  text: text().notNull(),
  processed: int().notNull().default(0),
  correct: int(),
  uri: text().notNull(),
  cid: text().notNull(),
  reply_to_uri: text(),
  reply_to_cid: text(),
  fen: text(),
})

const replies = aliasedTable(postsTable, 'replies')

export const marksView = sqliteView('marks').as((qb) =>
  qb
    .select({
      uri: replies.reply_to_uri,
      opDate: postsTable.createdAt,
      username: replies.username,
      mark: max(replies.correct).as('mark'),
    })
    .from(replies)
    .innerJoin(postsTable, eq(replies.reply_to_uri, postsTable.uri))
    .groupBy(replies.reply_to_uri, replies.username),
)
