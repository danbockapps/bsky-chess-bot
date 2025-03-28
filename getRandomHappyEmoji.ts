const getRandomHappyEmoji = (): string => {
  const randomIndex = Math.floor(Math.random() * happyEmojis.length)
  return happyEmojis[randomIndex]
}

const happyEmojis = [
  '😃',
  '😄',
  '😁',
  '🎉',
  '✅',
  '🍾',
  '👽',
  '🫶',
  '💪',
  '🫵',
  '💃',
  '🕺',
  '🦆',
  '🐎',
  '🐩',
  '🐱',
  '🔥',
  '🌸',
  '💫',
  '🌈',
  '🥑',
  '🍦',
  '🥂',
  '🍪',
  '🏄‍♂️',
  '🏆',
  '🥇',
  '🏅',
  '🎯',
  '🚀',
  '💛',
  '💰',
  '📈',
  '🎊',
  '💯',
  '🆒',
]

export default getRandomHappyEmoji
