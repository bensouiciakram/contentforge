import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createAiService } from '@/features/ai/lib'
import { errorResponse, AppError } from '@/lib/errors'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return errorResponse(new AppError('Unauthorized', 'UNAUTHORIZED', 401))
    }

    const body = await request.json()
    const prompt = body?.prompt

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return errorResponse(
        new AppError('Please enter a topic to generate', 'VALIDATION_ERROR', 400)
      )
    }

    const admin = createAdminClient()
    const { data: profile } = await admin
      .from('profiles')
      .select('ai_credits')
      .eq('id', user.id)
      .single()

    if (!profile || profile.ai_credits <= 0) {
      return errorResponse(
        new AppError('No credits remaining — upgrade to continue', 'INSUFFICIENT_CREDITS', 403)
      )
    }

    const service = createAiService()
    const aiStream = service.streamGenerate(prompt.trim())
    const trimmed = prompt.trim()

    let fullText = ''
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const sseStream = new ReadableStream({
      async start(controller) {
        const reader = aiStream.getReader()

        const cleanup = () => {
          try { reader.cancel() } catch {}
          try { controller.close() } catch {}
        }

        const abortHandler = () => {
          cleanup()
        }

        request.signal.addEventListener('abort', abortHandler, { once: true })

        try {
          while (true) {
            if (request.signal.aborted) {
              cleanup()
              return
            }
            const { done, value } = await reader.read()
            if (done) break
            const text = decoder.decode(value, { stream: true })
            fullText += text
            const data = JSON.stringify({ type: 'chunk', text })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          if (request.signal.aborted) {
            cleanup()
            return
          }

          const { data: saved, error: updateErr } = await admin
            .from('profiles')
            .update({ ai_credits: profile.ai_credits - 1 })
            .eq('id', user.id)
            .gt('ai_credits', 0)
            .select('ai_credits')
            .single()

          if (updateErr || !saved) {
            const errorData = JSON.stringify({ type: 'error', message: 'Credit deduction failed' })
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
            controller.close()
            return
          }

          const { data: generation, error: insertErr } = await admin
            .from('generations')
            .insert({
              user_id: user.id,
              prompt: trimmed,
              response: fullText,
              model: 'gemini-2.5-flash',
              tokens: 0,
            })
            .select('id')
            .single()

          if (insertErr) {
            await admin.from('profiles').update({ ai_credits: profile.ai_credits }).eq('id', user.id)
            const errorData = JSON.stringify({ type: 'error', message: 'Failed to save generation, credits restored' })
            controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
            controller.close()
            return
          }

          const doneData = JSON.stringify({
            type: 'done',
            id: generation?.id,
            credits: saved?.ai_credits,
          })
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`))
          controller.close()
        } catch (err) {
          const message =
            err instanceof AppError
              ? err.message
              : 'Generation interrupted — retry?'
          const errorData = JSON.stringify({ type: 'error', message })
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`))
          controller.close()
        } finally {
          request.signal.removeEventListener('abort', abortHandler)
        }
      },
    })

    return new Response(sseStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    return errorResponse(err)
  }
}
