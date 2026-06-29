import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreditCounter } from './credit-counter'

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('CreditCounter', () => {
  it('shows credits in "N / N" format', () => {
    render(<CreditCounter credits={8} maxCredits={10} />)
    expect(screen.getByTestId('credit-counter')).toHaveTextContent('8 / 10 credits')
  })

  it('shows normal styling when credits > 0', () => {
    render(<CreditCounter credits={5} maxCredits={100} />)
    const el = screen.getByTestId('credit-counter')
    expect(el.className).not.toContain('text-amber-600')
  })

  it('shows warning color and upgrade link when credits = 0', () => {
    render(<CreditCounter credits={0} maxCredits={10} />)
    const el = screen.getByTestId('credit-counter')
    expect(el.className).toContain('text-amber-600')
    expect(screen.getByTestId('upgrade-link')).toHaveAttribute('href', '/pricing')
  })

  it('shows warning color and upgrade link when credits < 0', () => {
    render(<CreditCounter credits={-1} maxCredits={10} />)
    expect(screen.getByTestId('credit-counter').className).toContain('text-amber-600')
    expect(screen.getByTestId('upgrade-link')).toBeInTheDocument()
  })
})
