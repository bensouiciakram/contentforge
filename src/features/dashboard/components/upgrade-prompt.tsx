import Link from 'next/link'

type UpgradePromptProps = {
  tier: string
}

export function UpgradePrompt({ tier }: UpgradePromptProps) {
  if (tier !== 'free') return null

  return (
    <p className="mt-1 text-xs text-zinc-400" data-testid="upgrade-prompt">
      Upgrade to Pro for 100 credits per month —{' '}
      <Link href="/pricing" className="font-medium text-zinc-900 hover:underline">
        View pricing
      </Link>
    </p>
  )
}
