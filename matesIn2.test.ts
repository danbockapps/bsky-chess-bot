// https://lichess.org/rw0ffa8F/black#65

import matesIn2 from './matesIn2'

const fen = '2b3k1/p4ppp/8/3B4/2P2Q2/P4PP1/2q4P/4RK2 b - - 4 33'

describe('matesIn2', () => {
  it('should return true if the given response leads to a checkmate in 2 moves', () => {
    const result = matesIn2(fen, 'Bh3+ Kg1 Qg2#')
    expect(result).toEqual(true)
  })

  it("shouldn't require + for check", () => {
    const result = matesIn2(fen, 'Bh3 Kg1 Qg2#')
    expect(result).toEqual(true)
  })

  it("shouldn't require # for mate", () => {
    const result = matesIn2(fen, 'Bh3+ Kg1 Qg2')
    expect(result).toEqual(true)
  })

  it("should return false if it's too short and not mate", () => {
    const result = matesIn2(fen, 'Bh3 Kg1')
    expect(result).toEqual(false)
  })

  it("should return false if it's not mate", () => {
    const result = matesIn2(fen, 'Bh3 Kg1 Bb7')
    expect(result).toEqual(false)
  })

  it('should handle numbers', () => {
    const result = matesIn2(fen, '1. Bh3+ Kg1 2. Qg2#')
    expect(result).toEqual(true)
  })

  it('should handle extraneous words', () => {
    const result = matesIn2(fen, 'Bh3+ and they must go Kg1 and then Qg2# and I win')
    expect(result).toEqual(true)
  })

  it('should handle line breaks', () => {
    const result = matesIn2(fen, 'Bh3+\nKg1\nQg2#')
    expect(result).toEqual(true)
  })

  it('should hande commas', () => {
    const result = matesIn2(fen, 'Bh3+, Kg1, Qg2#')
    expect(result).toEqual(true)
  })

  it('should handle periods', () => {
    const result = matesIn2(fen, '1...Bh3+ 2.Kg1 Qg2#')
    expect(result).toEqual(true)
  })

  it('should handle ++', () => {
    const result = matesIn2(fen, 'Bh3+ Kg1 Qg2++')
    expect(result).toEqual(true)
  })
})
