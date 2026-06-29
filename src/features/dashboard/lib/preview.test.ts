import { describe, it, expect } from 'vitest'
import { createPreview, getTitle } from './preview'

describe('createPreview', () => {
  it('strips markdown headers', () => {
    const result = createPreview('# How to Bake Bread\n\nBaking bread is easy.')
    expect(result).toBe('How to Bake Bread Baking bread is easy.')
  })

  it('strips bold and italic markers', () => {
    const result = createPreview('This is **bold** and *italic*')
    expect(result).toBe('This is bold and italic')
  })

  it('truncates long text with ellipsis', () => {
    const long = 'a'.repeat(150)
    const result = createPreview(long, 100)
    expect(result.length).toBe(101)
    expect(result.endsWith('…')).toBe(true)
  })

  it('returns short text as-is', () => {
    const result = createPreview('Hello world')
    expect(result).toBe('Hello world')
  })

  it('returns empty string for empty input', () => {
    expect(createPreview('')).toBe('')
  })
})

describe('getTitle', () => {
  it('returns first line of prompt', () => {
    const result = getTitle('How to Bake Bread\n\nSome details')
    expect(result).toBe('How to Bake Bread')
  })

  it('returns "Untitled" for empty prompt', () => {
    expect(getTitle('')).toBe('Untitled')
  })

  it('returns "Untitled" for whitespace-only prompt', () => {
    expect(getTitle('   ')).toBe('Untitled')
  })

  it('truncates very long first line', () => {
    const long = 'a'.repeat(100)
    const result = getTitle(long)
    expect(result.length).toBeLessThanOrEqual(80)
  })
})
