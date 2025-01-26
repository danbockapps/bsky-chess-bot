import getMoves from './getMoves'

describe('getMoves', () => {
  it('should return an array of valid moves from the given FEN and response', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const response = '1. e4 e5 2. Nf3 Nc6'
    const result = getMoves(fen, response)
    expect(result).toEqual(['e4', 'e5', 'Nf3', 'Nc6'])
  })

  it('should return an empty array if no valid moves are found', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const response = '1. e5 e6 2. Nf4 Nc7'
    const result = getMoves(fen, response)
    expect(result).toEqual([])
  })

  it('should handle responses with extra spaces correctly', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const response = '1. e4  e5  2. Nf3  Nc6'
    const result = getMoves(fen, response)
    expect(result).toEqual(['e4', 'e5', 'Nf3', 'Nc6'])
  })

  it('should handle responses with missing move numbers correctly', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const response = 'e4 e5 Nf3 Nc6'
    const result = getMoves(fen, response)
    expect(result).toEqual(['e4', 'e5', 'Nf3', 'Nc6'])
  })

  it('should handle responses with invalid moves correctly', () => {
    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    const response = '1. e4 e5 2. Nf3 Nc7'
    const result = getMoves(fen, response)
    expect(result).toEqual(['e4', 'e5', 'Nf3'])
  })
})
