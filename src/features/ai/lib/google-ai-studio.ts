import { GoogleGenerativeAI } from '@google/generative-ai'
import { AppError } from '@/lib/errors'
import type { AiService } from './types'

const SYSTEM_PROMPT = `You are a professional blog writer. Write a well-structured, engaging blog post in markdown format. Use headings, bullet points, and paragraphs to make it readable.`

export class GoogleAiStudioService implements AiService {
  private model

  constructor() {
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      throw new AppError('Missing Google AI API key', 'AI_CONFIG_ERROR', 500)
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }

  async generate(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(`${SYSTEM_PROMPT}\n\nTopic: ${prompt}`)
      return result.response.text()
    } catch (err) {
      throw new AppError(
        err instanceof Error ? err.message : 'AI API error',
        'AI_API_ERROR',
        502
      )
    }
  }

  streamGenerate(prompt: string): ReadableStream<Uint8Array> {
    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      start: async (controller) => {
        try {
          const result = await this.model.generateContentStream(
            `${SYSTEM_PROMPT}\n\nTopic: ${prompt}`
          )

          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(
            new AppError(
              err instanceof Error ? err.message : 'Stream failed',
              'AI_API_ERROR',
              502
            )
          )
        }
      },
    })

    return stream
  }
}
