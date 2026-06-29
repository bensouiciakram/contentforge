import { formatDate } from '../lib/format-date'

type ResetDateProps = {
  date: string | null
}

export function ResetDate({ date }: ResetDateProps) {
  return (
    <p className="mt-1 text-xs text-zinc-400" data-testid="reset-date">
      Credits reset {date ? `on ${formatDate(date)}` : 'monthly'}
    </p>
  )
}
