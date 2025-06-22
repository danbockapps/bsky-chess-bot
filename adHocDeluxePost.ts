import {deluxePost} from './deluxePost'

const text = '🚨 Test post @boldmovebydan.bsky.social and @chesspuzzlebot.bsky.social'

deluxePost([text])
  .then(() => console.log('Post sent successfully'))
  .catch((error) => console.error('Error sending post:', error))
