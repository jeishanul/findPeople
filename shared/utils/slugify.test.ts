import { describe, expect, it } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('strips leading/trailing separators', () => {
    expect(slugify('  --Foo Bar!!--  ')).toBe('foo-bar')
  })
})
