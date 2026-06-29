'use client'

import Link from 'next/link'
import { createPreview, getTitle } from '../lib/preview'
import { formatDate } from '../lib/format-date'

type GenerationListItemProps = {
  id: string
  prompt: string
  response: string
  model: string
  created_at: string
}

export function GenerationListItem({ id, prompt, response, model, created_at }: GenerationListItemProps) {
  return (
    <Link
      href={`/dashboard/history/${id}`}
      className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50"
      data-testid="generation-item"
    >
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-zinc-900">
          {getTitle(prompt)}
        </h4>
        <p className="mt-1 text-xs text-zinc-500">
          {createPreview(response)}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-zinc-400">
          <span>{formatDate(created_at)}</span>
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-zinc-500">{model}</span>
        </div>
      </div>
      <svg
        className="mt-0.5 h-4 w-4 shrink-0 text-zinc-300"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </Link>
  )
}
