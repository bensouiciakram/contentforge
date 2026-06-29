import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CreditGate } from '@/features/billing/components/credit-gate'
import { GenerateForm } from '@/features/ai/components/generate-form'
import { TIERS } from '@/features/billing/lib/config'
import Link from 'next/link'

export default async function GeneratePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier, ai_credits')
    .eq('id', user.id)
    .single()

  const credits = profile?.ai_credits ?? 0
  const tierId = (profile?.tier ?? 'free') as 'free' | 'pro' | 'enterprise'
  const tierConfig = TIERS.find(t => t.id === tierId)
  const maxCredits = tierConfig?.credits ?? 10

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <Link href="/dashboard" className="text-lg font-bold text-zinc-900">
          ContentForge
        </Link>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          {credits} / {maxCredits} credits
        </span>
      </header>

      <CreditGate credits={credits} tier={tierId}>
        <GenerateForm initialCredits={credits} />
      </CreditGate>
    </div>
  )
}
