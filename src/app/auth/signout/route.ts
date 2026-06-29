import { NextResponse } from 'next/server'
import { createClientFromRequest } from '@/lib/supabase/server-request'

export async function POST(request: Request) {
  const { supabase, response } = createClientFromRequest(request)
  await supabase.auth.signOut()

  const redirect = NextResponse.redirect(new URL('/', request.url))
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() === 'set-cookie') {
      redirect.headers.append('Set-Cookie', value)
    }
  }
  return redirect
}
