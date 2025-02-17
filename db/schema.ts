import {aliasedTable, desc, eq, max, sql, sum} from 'drizzle-orm'
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

/**
 * All should be marked properly starting with OP on 2/11/2025 12:00 UTC
 */

export const standingsView = sqliteView('standings').as((qb) =>
  qb
    .select({
      username: marksView.username,
      points: sum(marksView.mark).as('points'),
    })
    .from(marksView)
    .where(
      sql`${marksView.opDate} >= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-8 days') AND
          ${marksView.opDate} <= strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 day') AND
          ${marksView.opDate} > '2025-02-11T11:00:00Z'`,
    )
    .groupBy(marksView.username)
    .orderBy(desc(sum(marksView.mark))),
)
