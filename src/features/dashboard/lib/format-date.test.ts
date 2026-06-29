import { describe, it, expect } from 'vitest'
import { formatDate } from './format-date'

describe('formatDate', () => {
  it('formats an ISO date string to "Month Day"', () => {
    const result = formatDate('2026-07-23T12:00:00Z')
    expect(result).toBe('July 23')
  })

  it('formats a different date correctly', () => {
    const result = formatDate('2026-01-05T00:00:00Z')
    expect(result).toBe('January 5')
  })

  it('returns "Monthly" for invalid date string', () => {
    const result = formatDate('not-a-date')
    expect(result).toBe('Monthly')
  })

  it('handles empty string', () => {
    const result = formatDate('')
    expect(result).toBe('Monthly')
  })
})
