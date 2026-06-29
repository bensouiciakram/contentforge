import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AuthForm } from './auth-form'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: vi.fn(),
    },
  }),
}))

describe('AuthForm — signup mode', () => {
  it('renders email and password fields', () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByTestId('password-input')).toBeInTheDocument()
  })

  it('shows "Create your account" heading', () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByText('Create your account')).toBeInTheDocument()
  })

  it('shows "Sign Up" submit button', () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })

  it('renders Google OAuth button', () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('shows link to login for signup mode', () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByText('Log in')).toBeInTheDocument()
  })
})

describe('AuthForm — login mode', () => {
  it('shows "Welcome back" heading', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('shows "Sign In" submit button', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('shows link to signup for login mode', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('renders Google OAuth button', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })
})
