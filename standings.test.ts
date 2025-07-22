import {getPosts} from './standings'

describe('standings', () => {
  it('should generate standings posts correctly.', () => {
    const lines = [
      '🚨 Standings for week 22!',
      '',
      '1. @jimgoodale.bsky.social (27)',
      '2. @coverdrive12.bsky.social (25)',
      '3. @axelgilbert.bsky.social (24)',
      '4. @oc918.bsky.social (21)',
      '4. @brianmanker.bsky.social (21)',
      '6. @paulswartz.net (15)',
      '7. @shahbanu.kawaii.social (10)',
      '8. @ambivalentricky.bsky.social (4)',
      '9. @boldmovebydan.bsky.social (2)',
      '10. @kingofnews.bsky.social (1)',
    ]

    expect(getPosts([], '', lines)).toEqual([
      '🚨 Standings for week 22!\n' +
        '\n' +
        '1. @jimgoodale.bsky.social (27)\n' +
        '2. @coverdrive12.bsky.social (25)\n' +
        '3. @axelgilbert.bsky.social (24)\n' +
        '4. @oc918.bsky.social (21)\n' +
        '4. @brianmanker.bsky.social (21)\n' +
        '6. @paulswartz.net (15)\n' +
        '7. @shahbanu.kawaii.social (10)\n' +
        '8. @ambivalentricky.bsky.social (4)',
      '9. @boldmovebydan.bsky.social (2)\n' + '10. @kingofnews.bsky.social (1)',
    ])
  })
})
