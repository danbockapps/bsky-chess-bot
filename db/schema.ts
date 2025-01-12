import {int, sqliteTable, text} from 'drizzle-orm/sqlite-core'

// Apply changes to the database: npx drizzle-kit push

export const postsTable = sqliteTable('posts', {
  id: int().primaryKey({autoIncrement: true}),
  username: text().notNull(),
  createdAt: text().notNull(),
  text: text().notNull(),
  processed: int().notNull().default(0),
  uri: text().notNull(),
  cid: text().notNull(),
  reply_to_uri: text(),
  reply_to_cid: text(),
})
