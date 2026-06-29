export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(date)
  } catch {
    return 'Monthly'
  }
}
