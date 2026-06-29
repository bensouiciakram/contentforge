# ContentForge

AI-powered blog writing SaaS. Turn a topic into a publishable blog post in seconds.

Built with Next.js 16, Supabase (auth + DB + RLS), Stripe (subscriptions), and Google AI Studio (Gemini 2.5 Flash).

## Features

- **Auth** — Email/password + Google OAuth via Supabase Auth
- **3 Tiers** — Free (10 credits/mo), Pro ($29, 100 credits), Enterprise ($99, 500 credits)
- **Stripe Checkout** — Subscription payments + webhook lifecycle
- **AI Generation** — Streaming blog posts via Gemini 2.5 Flash (SSE)
- **Credit Gating** — Usage-based paywall, atomic credit deduction
- **Dashboard** — Tier badge, credit counter with reset date, recent posts
- **History** — Paginated generation history with read-only detail view

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Auth + DB | Supabase (PostgreSQL + RLS) |
| Payments | Stripe Checkout + Webhooks |
| AI | Google AI Studio (Gemini 2.5 Flash) |
| Forms | react-hook-form + zod |
| Data Fetching | React Query (TanStack Query) |
| Testing | Vitest + Testing Library |

## Getting Started

```bash
cd contentforge
cp .env.local.example .env.local  # fill in your keys
npm install
npm run dev
```

Open http://localhost:3000

### Required environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_STRIPE_PRICE_PRO` | Stripe Price ID for Pro tier |
| `NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE` | Stripe Price ID for Enterprise |
| `GOOGLE_AI_API_KEY` | Google AI Studio API key |

### Testing webhooks

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

## Project Structure

```
src/
├── app/           # Next.js App Router (pages + API)
│   ├── api/       # API routes
│   ├── auth/      # Signup, login, callback
│   ├── dashboard/ # Dashboard, generate, history
│   └── pricing/   # Pricing page
├── features/      # Feature modules
│   ├── ai/        # AI generation service
│   ├── auth/      # Auth forms + hooks
│   ├── billing/   # Pricing, credits, Stripe
│   └── dashboard/ # Dashboard components
└── lib/           # Shared utilities
    ├── supabase/  # DB clients
    ├── stripe/    # Stripe client
    └── types/     # TypeScript types
```

## License

MIT
