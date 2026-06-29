import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { signUpSchema } from '@/features/auth/lib/schemas'

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

  const parsed = signUpSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message, code: 'VALIDATION_ERROR' },
      { status: 400 }
    )
  }

  const { email, password } = parsed.data
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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
    },
  })

  if (error) {
    const code = error.message.includes('already registered')
      ? 'EMAIL_EXISTS'
      : 'AUTH_ERROR'
    return NextResponse.json({ error: error.message, code }, { status: 409 })
  }

  return response
}
