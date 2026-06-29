import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TIERS } from '@/features/billing/lib/config'
import { PricingCard } from '@/features/billing/components/pricing-card'

export default async function PricingPage(props: {
  searchParams: Promise<{ cancelled?: string; error?: string }>
}) {
  const searchParams = await props.searchParams
  const cancelled = searchParams.cancelled === 'true'
  const errorParam = searchParams.error
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userTier: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single()

    userTier = profile?.tier ?? 'free'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold text-zinc-900">ContentForge</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <a
              href="/dashboard"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </a>
          ) : (
            <>
              <a
                href="/auth/login"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Log in
              </a>
              <a
                href="/auth/signup"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Get Started Free
              </a>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 py-16">
        {cancelled && (
          <div className="mb-8 w-full max-w-md rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 text-center">
            Payment cancelled — no changes made
          </div>
        )}
        {errorParam && (
          <div className="mb-8 w-full max-w-md rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
            Payment failed, please try again
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
          Simple, transparent pricing
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          Choose the plan that fits your content needs
        </p>

        <div className="mt-12 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isCurrentPlan={userTier === tier.id}
              userTier={userTier}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
