import { describe, it, expect } from 'vitest'

import { highlightText } from '../highlightText'

describe('highlightText', () => {
  it('returns original text when query is empty', () => {
    const text = 'Hello World'
    const query = ''
    expect(highlightText(text, query)).toBe(text)
  })

  it('returns original text when query has no matches', () => {
    const text = 'Hello World'
    const query = 'Foo'
    expect(highlightText(text, query)).toBe(text)
  })

  it('highlights single match', () => {
    const text = 'Hello World'
    const query = 'World'
    expect(highlightText(text, query)).toBe(
      'Hello <mark class="bg-yellow-200 rounded-sm">World</mark>',
    )
  })

  it('highlights multiple matches', () => {
    const text = 'Hello World World'
    const query = 'World'
    expect(highlightText(text, query)).toBe(
      'Hello <mark class="bg-yellow-200 rounded-sm">World</mark> <mark class="bg-yellow-200 rounded-sm">World</mark>',
    )
  })

  it('highlights case-insensitive match', () => {
    const text = 'Hello WORLD'
    const query = 'world'
    expect(highlightText(text, query)).toBe(
      'Hello <mark class="bg-yellow-200 rounded-sm">WORLD</mark>',
    )
  })

  it('matches special characters correctly', () => {
    const text = 'Hello @World!'
    const query = '@World'
    expect(highlightText(text, query)).toBe(
      'Hello <mark class="bg-yellow-200 rounded-sm">@World</mark>!',
    )
  })
})
