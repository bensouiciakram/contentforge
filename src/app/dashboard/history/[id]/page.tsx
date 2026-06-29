import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { TierBadge } from '@/features/dashboard/components/tier-badge'
import { formatDate } from '@/features/dashboard/lib/format-date'
import { CopyButton } from './copy-button'

export default async function HistoryDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
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

  const { data: generation, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!generation || error) {
    notFound()
  }

  const tierId = (profile?.tier ?? 'free') as 'free' | 'pro' | 'enterprise'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
        <Link href="/dashboard" className="text-lg font-bold text-zinc-900">ContentForge</Link>
        <div className="flex items-center gap-4">
          <TierBadge tier={tierId} />
          <Link
            href="/dashboard/history"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            History
          </Link>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-zinc-600 hover:text-zinc-900">Log out</button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
        >
          &larr; Back to History
        </Link>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-zinc-500">
              <span>Created {formatDate(generation.created_at)}</span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-500">
                {generation.model}
              </span>
            </div>
            <CopyButton content={generation.response} />
          </div>

          <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
            <span className="font-medium text-zinc-900">Prompt:</span> {generation.prompt}
          </div>

          <article className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-zinc-900">
            {generation.response}
          </article>
        </div>
      </main>
    </div>
  )
}
