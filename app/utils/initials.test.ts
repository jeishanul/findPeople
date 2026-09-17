import { describe, expect, it } from 'vitest'
import { initialsFor } from './initials'

describe('initialsFor', () => {
  it('takes the first letter of the first two words', () => {
    expect(initialsFor('Amara Chen')).toBe('AC')
  })

  it('upper-cases lowercase input', () => {
    expect(initialsFor('amara chen')).toBe('AC')
  })

  it('handles a single-word name', () => {
    expect(initialsFor('Cher')).toBe('C')
  })

  it('ignores a third word and extra whitespace', () => {
    expect(initialsFor('  Amara   Chen Lopez ')).toBe('AC')
  })

  it('returns an empty string for empty input', () => {
    expect(initialsFor('')).toBe('')
  })
})
