import { GoogleAiStudioService } from './google-ai-studio'
import type { AiService } from './types'

let instance: AiService | null = null

export function createAiService(): AiService {
  if (!instance) {
    instance = new GoogleAiStudioService()
  }
  return instance
}

export type { AiService }
