const getRandomCorrect = (): string => {
  const randomIndex = Math.floor(Math.random() * messages.length)
  return messages[randomIndex]
}

const messages = [
  "Yes, that's correct!",
  "That's right!",
  "That's the right answer!",
  'Correct!',
  'You got it!',
]

export default getRandomCorrect
