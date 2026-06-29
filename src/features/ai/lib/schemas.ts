import { z } from 'zod'

export const generateSchema = z.object({
  prompt: z.string().trim().min(1, 'Please enter a topic to generate'),
})

export const updateGenerationSchema = z.object({
  response: z.string().min(1, 'Response content is required'),
})

export type GenerateInput = z.infer<typeof generateSchema>
export type UpdateGenerationInput = z.infer<typeof updateGenerationSchema>
