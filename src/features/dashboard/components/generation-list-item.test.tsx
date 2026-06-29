import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GenerationListItem } from './generation-list-item'

const mockGen = {
  id: 'gen-1',
  prompt: 'How to Bake Bread',
  response: 'Baking bread is easy and fun. Follow these steps.',
  model: 'gemini-2.5-flash',
  created_at: '2026-07-15T12:00:00Z',
}

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('GenerationListItem', () => {
  it('renders title from prompt', () => {
    render(<GenerationListItem {...mockGen} />)
    expect(screen.getByTestId('generation-item')).toHaveTextContent('How to Bake Bread')
  })

  it('renders preview from response', () => {
    render(<GenerationListItem {...mockGen} />)
    expect(screen.getByTestId('generation-item')).toHaveTextContent('Baking bread is easy and fun.')
  })

  it('renders model name', () => {
    render(<GenerationListItem {...mockGen} />)
    expect(screen.getByTestId('generation-item')).toHaveTextContent('gemini-2.5-flash')
  })

  it('links to detail page', () => {
    render(<GenerationListItem {...mockGen} />)
    const link = screen.getByTestId('generation-item')
    expect(link).toHaveAttribute('href', '/dashboard/history/gen-1')
  })
})
