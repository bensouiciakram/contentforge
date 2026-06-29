import Link from 'next/link'

type CreditGateProps = {
  credits: number
  tier: string
  children: React.ReactNode
}

export function CreditGate({ credits, tier, children }: CreditGateProps) {
  const isExhausted = credits <= 0

  if (!isExhausted) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-amber-100 p-3">
        <svg
          className="h-8 w-8 text-amber-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="mt-4 text-xl font-bold text-zinc-900">
        No credits remaining
      </h2>
      <p className="mt-2 text-zinc-600">
        You&apos;ve used all {tier === 'free' ? '10 free' : 'your'} credits.
        {tier === 'free' ? ' Upgrade to keep generating content.' : ''}
      </p>
      {tier === 'free' ? (
        <Link
          href="/pricing"
          className="mt-6 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Upgrade to continue
        </Link>
      ) : (
        <Link
          href="/pricing"
          className="mt-6 rounded-md border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          View pricing plans
        </Link>
      )}
    </div>
  )
}
