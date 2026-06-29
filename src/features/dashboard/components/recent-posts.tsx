import { createClient } from '@/lib/supabase/server'
import { GenerationListItem } from './generation-list-item'
import { EmptyState } from './empty-state'

export async function RecentPosts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('generations')
    .select('id, prompt, response, model, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const generations = data ?? []

  if (generations.length === 0) {
    return (
      <section className="border-t border-zinc-200 px-6 py-8" data-testid="recent-posts">
        <h3 className="text-lg font-semibold text-zinc-900">Recent Posts</h3>
        <EmptyState compact />
      </section>
    )
  }

  return (
    <section className="border-t border-zinc-200 px-6 py-8" data-testid="recent-posts">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900">Recent Posts</h3>
        <a
          href="/dashboard/history"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          View all
        </a>
      </div>
      <div className="space-y-3">
        {generations.map((gen) => (
          <GenerationListItem key={gen.id} {...gen} />
        ))}
      </div>
    </section>
  )
}
