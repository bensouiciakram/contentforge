type TierBadgeProps = {
  tier: string
}

const tierStyles: Record<string, string> = {
  free: 'bg-zinc-100 text-zinc-600',
  pro: 'bg-blue-100 text-blue-700',
  enterprise: 'bg-purple-100 text-purple-700',
}

export function TierBadge({ tier }: TierBadgeProps) {
  const style = tierStyles[tier] ?? tierStyles.free
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${style}`}
      data-testid="tier-badge"
    >
      {tier}
    </span>
  )
}
