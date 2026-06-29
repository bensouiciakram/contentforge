import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TierBadge } from './tier-badge'

describe('TierBadge', () => {
  it('renders the tier text', () => {
    render(<TierBadge tier="free" />)
    expect(screen.getByTestId('tier-badge')).toHaveTextContent('free')
  })

  it('renders pro tier', () => {
    render(<TierBadge tier="pro" />)
    expect(screen.getByTestId('tier-badge')).toHaveTextContent('pro')
  })

  it('renders enterprise tier', () => {
    render(<TierBadge tier="enterprise" />)
    expect(screen.getByTestId('tier-badge')).toHaveTextContent('enterprise')
  })

  it('capitalizes the tier text', () => {
    render(<TierBadge tier="pro" />)
    const el = screen.getByTestId('tier-badge')
    expect(el.className).toContain('capitalize')
  })
})
