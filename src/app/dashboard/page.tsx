import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreditGate } from '@/features/billing/components/credit-gate'
import { TierBadge } from '@/features/dashboard/components/tier-badge'
import { CreditCounter } from '@/features/dashboard/components/credit-counter'
import { ResetDate } from '@/features/dashboard/components/reset-date'
import { UpgradePrompt } from '@/features/dashboard/components/upgrade-prompt'
import { TIERS } from '@/features/billing/lib/config'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const credits = profile?.ai_credits ?? 0
  const tierId = (profile?.tier ?? 'free') as 'free' | 'pro' | 'enterprise'
  const tierConfig = TIERS.find(t => t.id === tierId)
  const maxCredits = tierConfig?.credits ?? 10
  const creditsResetAt = profile?.credits_reset_at ?? null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <span className="text-lg font-bold text-zinc-900">ContentForge</span>
        <div className="flex items-center gap-4">
          <TierBadge tier={tierId} />
          <form action="/auth/signout" method="post">
            <button className="text-sm text-zinc-600 hover:text-zinc-900">
              Log out
            </button>
          </form>
        </div>
      </header>

      <CreditGate credits={credits} tier={tierId}>
        <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h2 className="text-2xl font-bold text-zinc-900">Welcome to ContentForge</h2>
          <div className="mt-2">
            <CreditCounter credits={credits} maxCredits={maxCredits} />
            <ResetDate date={creditsResetAt} />
            <UpgradePrompt tier={tierId} />
          </div>
          <a
            href="/dashboard/generate"
            className="mt-8 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Generate your first post
          </a>
        </main>
      </CreditGate>
    </div>
  )
}
