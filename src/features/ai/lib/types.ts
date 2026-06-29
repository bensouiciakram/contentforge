export interface AiService {
  generate(prompt: string): Promise<string>
  streamGenerate(prompt: string): ReadableStream<Uint8Array>
}
