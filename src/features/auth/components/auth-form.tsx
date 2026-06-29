'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema, loginSchema, type SignUpInput, type LoginInput } from '../lib/schemas'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

type AuthFormProps = {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const isSignUp = mode === 'signup'
  const schema = isSignUp ? signUpSchema : loginSchema
  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput | LoginInput>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: SignUpInput | LoginInput) {
    setLoading(true)
    setAuthError(null)

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/signin'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })

      if (!res.ok) {
        const body = await res.json()
        setAuthError(body.error ?? 'Something went wrong')
        setLoading(false)
        return
      }

      window.location.assign('/dashboard')
    } catch {
      setAuthError('Network error — please try again')
      setLoading(false)
    }
  }

  async function signInWithGoogle() {
    setLoading(true)
    setAuthError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setAuthError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="mb-8 text-sm text-zinc-600">
        {isSignUp ? 'Start generating blog posts with AI' : 'Sign in to your account'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="auth-form">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder="you@example.com"
            data-testid="email-input"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" data-testid="email-error">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            placeholder={isSignUp ? 'At least 6 characters' : ''}
            data-testid="password-input"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600" data-testid="password-error">{errors.password.message}</p>
          )}
        </div>

        {authError && (
          <p className="text-sm text-red-600" data-testid="auth-error">{authError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          data-testid="submit-button"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs text-zinc-500">
          <span className="bg-white px-2">or</span>
        </div>
      </div>

      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        data-testid="google-button"
      >
        Continue with Google
      </button>

      <p className="mt-4 text-center text-sm text-zinc-600">
        {isSignUp ? (
          <>
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-zinc-900 hover:underline">
              Log in
            </a>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="font-medium text-zinc-900 hover:underline">
              Sign up
            </a>
          </>
        )}
      </p>
    </div>
  )
}
