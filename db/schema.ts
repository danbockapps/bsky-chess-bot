import {int, sqliteTable, text} from 'drizzle-orm/sqlite-core'

// Apply changes to the database: npx drizzle-kit push

export const postsTable = sqliteTable('posts', {
  id: int().primaryKey({autoIncrement: true}),
  username: text().notNull(),
  date: text().notNull(),
  text: text().notNull(),
  uri: text().notNull(),
  cid: text().notNull(),
})
