export function createPreview(text: string, maxChars = 100): string {
  if (!text) return ''
  const stripped = text
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~`]/g, '')
    .replace(/^[-*+]\s/gm, '')
    .replace(/>\s/g, '')
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (stripped.length <= maxChars) return stripped
  return stripped.slice(0, maxChars).trimEnd() + '…'
}

export function getTitle(prompt: string): string {
  if (!prompt || !prompt.trim()) return 'Untitled'
  const firstLine = prompt.trim().split('\n')[0].trim()
  if (firstLine.length > 80) return firstLine.slice(0, 77).trimEnd() + '…'
  return firstLine
}
