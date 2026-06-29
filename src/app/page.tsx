export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-lg font-bold text-zinc-900">ContentForge</span>
        <div className="flex items-center gap-4">
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
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Turn one topic into a publishable blog post in seconds
        </h1>
        <p className="mt-4 max-w-xl text-lg text-zinc-600">
          ContentForge uses AI to help solopreneurs and small business owners
          create blog content fast. No writer&apos;s block, no hours lost.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <a
            href="/auth/signup"
            className="rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Get Started Free
          </a>
          <a
            href="/pricing"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            View Pricing
          </a>
        </div>
      </main>
    </div>
  )
}
