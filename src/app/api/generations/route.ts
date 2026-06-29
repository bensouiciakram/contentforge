import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, AppError } from '@/lib/errors'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return errorResponse(new AppError('Unauthorized', 'UNAUTHORIZED', 401))
    }

    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') ?? '10', 10)))
    const offset = (page - 1) * limit

    const { data, error } = await supabase
      .from('generations')
      .select('id, prompt, response, model, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return errorResponse(new AppError('Failed to fetch generations', 'DB_ERROR', 500))
    }

    return NextResponse.json({
      data: data ?? [],
      hasMore: (data?.length ?? 0) === limit,
      page,
    })
  } catch (err) {
    return errorResponse(err)
  }
}
