# CLAUDE.md

## Overview

This is a bot for the social media site **Bluesky**. It posts a chess puzzle
every 6 hours, reads people's replies to those puzzles, saves them to the
database, evaluates whether each answer is correct, and once a week tabulates
the standings and posts them.

## Cron jobs

Both run at 00:00, 06:00, 12:00, and 18:00 daily (`0,6,12,18 * * *`), from
`~/projects/bsky-chess-bot`:

1. **Post a puzzle** — appends the date to `log.txt`, then:
   `npx tsx puzzle.ts mateIn2_2200.csv` (stdout → `log.txt`, stderr → `error.txt`)
2. **Save replies** — appends the date to `saveLog.txt`, then:
   `npx tsx saveRepliesToDb.ts` (stdout → `saveLog.txt`, stderr → `saveError.txt`)

## Key scripts

- `puzzle.ts <puzzles.csv>` — posts the next chess puzzle (e.g. `mateIn2_2200.csv`).
- `saveRepliesToDb.ts` — reads puzzle replies, saves them to the DB, and evaluates correctness.
- Standings are tabulated and posted weekly.
