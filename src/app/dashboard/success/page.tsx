'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SuccessPage() {
  const [polling, setPolling] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setPolling(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="rounded-full bg-green-100 p-3">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900">
        Subscription activated successfully
      </h1>
      <p className="mt-2 text-zinc-600">
        {polling
          ? 'Your plan and credits are being updated...'
          : 'Your plan and credits should be updated. Head to your dashboard to confirm.'}
      </p>
      <Link
        href="/dashboard"
        className="mt-8 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
