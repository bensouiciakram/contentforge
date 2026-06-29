import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('shows "No posts yet" message', () => {
    render(<EmptyState />)
    expect(screen.getByTestId('empty-state')).toHaveTextContent('No posts yet')
  })

  it('shows "Generate Post" button linking to /dashboard/generate', () => {
    render(<EmptyState />)
    const link = screen.getByText('Generate Post')
    expect(link).toHaveAttribute('href', '/dashboard/generate')
  })

  it('renders compact variant without errors', () => {
    render(<EmptyState compact />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
})
