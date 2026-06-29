'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { GenerationListItem } from './generation-list-item'
import { EmptyState } from './empty-state'

export function GenerationList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['generations'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/generations?page=${pageParam}&limit=10`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json() as Promise<{
        data: Array<{ id: string; prompt: string; response: string; model: string; created_at: string }>
        hasMore: boolean
        page: number
      }>
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  })

  const allGenerations = data?.pages.flatMap(p => p.data) ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-sm text-zinc-500">Loading...</div>
      </div>
    )
  }

  if (allGenerations.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-3">
      {allGenerations.map((gen) => (
        <GenerationListItem key={gen.id} {...gen} />
      ))}
      {hasNextPage && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-md border border-zinc-300 px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            data-testid="load-more"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  )
}
