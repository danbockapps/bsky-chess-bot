import {configDotenv} from 'dotenv'
import {db} from './db'
import {standingsView} from './db/schema'
import {deluxePost} from './deluxePost'

const WEEK_ONE_START = new Date('2025-02-18')
const CHAR_LIMIT = 300

console.log()
console.log('_______________standings.ts_______________')
console.log(new Date().toISOString())
console.time('standings')
configDotenv()

const postStandings = async () => {
  const qr = await db.select().from(standingsView)
  const processedQr = qr.map((r) => ({...r, points: Number(r.points)}))

  const rankings = processedQr.reduce(
    (acc, cur, i) => {
      const rank = i === 0 ? 1 : acc[i - 1].points === cur.points ? acc[i - 1].rank : i + 1
      return [...acc, {...cur, rank}]
    },
    [] as {username: string; points: number; rank: number}[],
  )

  const lines = [
    `🚨 Standings for week ${getWeekNumberFromStart(new Date(), WEEK_ONE_START)}!`,
    '',
    ...rankings.map((r) => `${r.rank}. @${r.username} (${r.points})`),
  ]

  const posts = getPosts([], '', lines)
  console.log(posts)
  await deluxePost(posts)
}

postStandings().finally(() => {
  console.timeEnd('standings')
})

const getPosts = (posts: string[], currentPost: string, lines: string[]): string[] => {
  if (lines.length === 0) return posts
  const candidatePost = currentPost + (currentPost.length === 0 ? '' : '\n') + lines[0]
  if (candidatePost.length > CHAR_LIMIT) return getPosts([...posts, currentPost], '', lines)
  else return getPosts(posts, candidatePost, lines.slice(1))
}

function getWeekNumberFromStart(date: Date, weekOneStart: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diffDays = Math.floor((date.getTime() - weekOneStart.getTime()) / msPerDay)
  return Math.floor(diffDays / 7) + 1
}
