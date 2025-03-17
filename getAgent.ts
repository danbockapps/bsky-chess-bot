import {AtpAgent} from '@atproto/api'
import {configDotenv} from 'dotenv'

configDotenv()

const getAgent = async () => {
  const agent = new AtpAgent({service: 'https://bsky.social'})

  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password: process.env.BLUESKY_PASSWORD!,
  })

  return agent
}

export default getAgent
