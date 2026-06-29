import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(request: Request) {
  let body: { email?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body', code: 'INVALID_JSON' },
      { status: 400 }
    )
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: 'Email and password are required', code: 'MISSING_FIELDS' },
      { status: 400 }
    )
  }

  const { email, password } = body
  const response = NextResponse.json({ success: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookie = request.headers.get('cookie') ?? ''
          return cookie.split(';').filter(Boolean).map((c) => {
            const [name, ...rest] = c.trim().split('=')
            return { name, value: rest.join('=') }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json(
      { error: error.message, code: 'AUTH_ERROR' },
      { status: 401 }
    )
  }

  return response
}
