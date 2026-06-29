'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TierConfig } from '../lib/config'

type PricingCardProps = {
  tier: TierConfig
  isCurrentPlan: boolean
  userTier: string | null
}

export function PricingCard({ tier, isCurrentPlan, userTier }: PricingCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function getButtonLabel() {
    if (loading) return 'Processing...'
    if (isCurrentPlan) return 'Current Plan'
    if (userTier === 'free' && tier.id !== 'free') return 'Upgrade'
    return 'Get Started'
  }

  async function handleClick() {
    if (userTier === null) {
      router.push('/auth/signup')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: tier.priceId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 ${
        isCurrentPlan
          ? 'border-zinc-900 ring-1 ring-zinc-900'
          : 'border-zinc-200'
      }`}
    >
      <div className="flex flex-1 flex-col">
        {isCurrentPlan && (
          <span className="mb-3 inline-block w-fit rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
            Current Plan
          </span>
        )}

        <h3 className="text-lg font-semibold text-zinc-900">{tier.name}</h3>
        <p className="mt-1">
          <span className="text-3xl font-bold text-zinc-900">${tier.price}</span>
          <span className="text-sm text-zinc-500">/month</span>
        </p>
        <p className="mt-1 text-sm text-zinc-600">{tier.credits} credits per month</p>

        <ul className="mt-6 space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-zinc-600">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
      )}

      {userTier !== null && tier.id === 'free' && userTier !== 'free' ? null : (
        <button
          onClick={handleClick}
          disabled={loading || isCurrentPlan}
          className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-medium ${
            isCurrentPlan
              ? 'cursor-default border border-zinc-300 bg-white text-zinc-400'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50'
          }`}
        >
          {getButtonLabel()}
        </button>
      )}
    </div>
  )
}
