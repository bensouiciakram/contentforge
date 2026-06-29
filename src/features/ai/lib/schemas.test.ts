import { describe, it, expect } from 'vitest'
import { generateSchema, updateGenerationSchema } from './schemas'

describe('generateSchema', () => {
  it('accepts a valid prompt', () => {
    const result = generateSchema.safeParse({ prompt: 'How to bake bread' })
    expect(result.success).toBe(true)
  })

  it('rejects empty prompt', () => {
    const result = generateSchema.safeParse({ prompt: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a topic to generate')
    }
  })

  it('rejects whitespace-only prompt', () => {
    const result = generateSchema.safeParse({ prompt: '   ' })
    expect(result.success).toBe(false)
  })
})

describe('updateGenerationSchema', () => {
  it('accepts valid response', () => {
    const result = updateGenerationSchema.safeParse({ response: 'Blog content...' })
    expect(result.success).toBe(true)
  })

  it('rejects empty response', () => {
    const result = updateGenerationSchema.safeParse({ response: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Response content is required')
    }
  })

  it('rejects non-string response', () => {
    const result = updateGenerationSchema.safeParse({ response: 123 })
    expect(result.success).toBe(false)
  })
})
