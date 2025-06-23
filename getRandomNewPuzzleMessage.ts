const getRandomNewPuzzleMessage = (): string => {
  return messages[Math.floor(Math.random() * messages.length)]
}

const messages = [
  'And I just posted a new puzzle. Check it out!',
  'I just posted a new puzzle. Can you solve that too?',
  "But that's not all: I just posted a new puzzle for you!",
  "I also just posted a new puzzle, if you're not sick of them yet.",
  'I just posted a new puzzle, but it might be harder than this one. Or it might not be. Who knows?',
  'And since I never stop posting puzzles, I just posted a new one.',
  'And I just posted a new puzzle, because why not?',
  'And I just posted a new puzzle, because I can.',
  'And I just posted a new puzzle, because I just have so much love to give, and also chess puzzles.',
  "I just posted another one. I don't think you can do it. Prove me wrong.",
  'And I just posted a new puzzle, because I love puzzles and I love you.',
  "And don't look now, but another puzzle just dropped.",
  'Fresh puzzle up now! Chess puzzle bot never sleeps.',
  'Fresh puzzle up now!',
  "I just posted a new puzzle. Sometimes I wonder if I'm posting too many puzzles, but then I remember how demanding you all are.",
  "New puzzle just posted. Sometimes I wish I could take a break, but they don't let me.",
  'New puzzle just posted. I hope you like it.',
  "If you're ready for more, I just posted a new puzzle.",
  'And I just posted a new puzzle, because I can never post enough puzzles.',
  "And I just posted a new puzzle, because I can't stop posting puzzles.",
  'I just posted another one. Do it with your morning coffee, or with your evening coffee, or with your midnight coffee.',
]

export default getRandomNewPuzzleMessage
