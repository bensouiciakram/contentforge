import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { errorResponse, AppError } from '@/lib/errors'
import { updateGenerationSchema } from '@/features/ai/lib/schemas'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return errorResponse(new AppError('Unauthorized', 'UNAUTHORIZED', 401))
    }

    const { response } = updateGenerationSchema.parse(await request.json())

    const { error } = await supabase
      .from('generations')
      .update({ response })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return errorResponse(new AppError('Failed to update post', 'DB_ERROR', 500))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return errorResponse(err)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return errorResponse(new AppError('Unauthorized', 'UNAUTHORIZED', 401))
    }

    const { error } = await supabase
      .from('generations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return errorResponse(new AppError('Failed to delete post', 'DB_ERROR', 500))
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return errorResponse(err)
  }
}
