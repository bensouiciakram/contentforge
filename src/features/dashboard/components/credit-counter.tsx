import Link from 'next/link'

type CreditCounterProps = {
  credits: number
  maxCredits: number
}

export function CreditCounter({ credits, maxCredits }: CreditCounterProps) {
  const isExhausted = credits <= 0

  return (
    <p className={`text-sm ${isExhausted ? 'text-amber-600 font-medium' : 'text-zinc-500'}`} data-testid="credit-counter">
      {credits} / {maxCredits} credits
      {isExhausted && (
        <Link
          href="/pricing"
          className="ml-2 inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 hover:bg-amber-200"
          data-testid="upgrade-link"
        >
          Upgrade
        </Link>
      )}
    </p>
  )
}
