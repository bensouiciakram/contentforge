'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateSchema, type GenerateInput } from '../lib/schemas'

type GenerateFormProps = {
  initialCredits: number
}

export function GenerateForm({ initialCredits }: GenerateFormProps) {
  const [content, setContent] = useState('')
  const [credits, setCredits] = useState(initialCredits)
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const [saved, setSaved] = useState(false)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GenerateInput>({
    resolver: zodResolver(generateSchema),
  })

  async function handleGenerate(data: GenerateInput) {
    setGenerating(true)
    setError(null)
    setContent('')
    setDone(false)
    setSaved(false)
    setGenerationId(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: data.prompt }),
      })

      if (!res.ok) {
        const body = await res.json()
        setError(body.error ?? 'Generation failed')
        setGenerating(false)
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const parsed = JSON.parse(line.slice(6))
            if (parsed.type === 'chunk') {
              setContent((prev) => prev + parsed.text)
            } else if (parsed.type === 'done') {
              setDone(true)
              setGenerationId(parsed.id ?? null)
              setCredits(parsed.credits ?? credits - 1)
            } else if (parsed.type === 'error') {
              setError(parsed.message)
            }
          } catch {
            // skip malformed lines
          }
        }
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setGenerating(false)
    }
  }

  async function handleSave() {
    if (!generationId) return
    const res = await fetch(`/api/generations/${generationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response: content }),
    })
    if (res.ok) setSaved(true)
  }

  async function handleDelete() {
    if (!generationId) return
    const res = await fetch(`/api/generations/${generationId}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      setContent('')
      setDone(false)
      setSaved(false)
      setGenerationId(null)
      reset()
      setShowDeleteConfirm(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
      <form onSubmit={handleSubmit(handleGenerate)} className="flex items-start gap-3">
        <div className="flex-1">
          <textarea
            {...register('prompt')}
            placeholder="Enter a topic to generate a blog post..."
            rows={2}
            disabled={generating}
            className="w-full resize-none rounded-md border border-zinc-300 px-4 py-3 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 disabled:opacity-50"
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-600">{errors.prompt.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={generating || credits <= 0}
          className="mt-0 h-fit shrink-0 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {generating ? 'Generating...' : 'Generate'}
        </button>
      </form>

      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">
          {credits} credits remaining
        </span>
        {done && generationId && !saved && (
          <button
            onClick={handleSave}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Save
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          {content && (
            <button
              onClick={handleSubmit(handleGenerate)}
              className="ml-2 font-medium underline"
            >
              Retry
            </button>
          )}
        </div>
      )}

      {(content || generating) && (
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] w-full resize-y rounded-md border border-zinc-300 p-4 font-mono text-sm leading-relaxed focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          placeholder="Generated content will appear here..."
        />
      )}

      {saved && generationId && (
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-600">Delete this post?</span>
              <button
                onClick={handleDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
