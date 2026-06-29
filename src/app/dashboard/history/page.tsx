import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TierBadge } from '@/features/dashboard/components/tier-badge'
import { GenerationList } from '@/features/dashboard/components/generation-list'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  const tierId = (profile?.tier ?? 'free') as 'free' | 'pro' | 'enterprise'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <Link href="/dashboard" className="text-lg font-bold text-zinc-900">ContentForge</Link>
        <div className="flex items-center gap-4">
          <TierBadge tier={tierId} />
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Dashboard
          </Link>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-zinc-600 hover:text-zinc-900">Log out</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">Generation History</h1>
        <GenerationList />
      </main>
    </div>
  )
}
