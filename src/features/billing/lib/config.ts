export type TierId = 'free' | 'pro' | 'enterprise'

export type TierConfig = {
  id: TierId
  name: string
  price: number
  credits: number
  features: string[]
  priceId: string
}

export const TIERS: TierConfig[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 10,
    features: [
      '10 AI-generated posts per month',
      'Basic AI model',
      'Manual editing',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE ?? 'price_free',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    credits: 100,
    features: [
      '100 AI-generated posts per month',
      'Advanced AI model',
      'Priority generation',
      'Markdown export',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? 'price_pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    credits: 500,
    features: [
      '500 AI-generated posts per month',
      'Premium AI model',
      'Priority generation',
      'Markdown export',
      'SEO optimization suggestions',
      'Team collaboration (up to 5 seats)',
    ],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE ?? 'price_enterprise',
  },
]

export function getTierByPriceId(priceId: string): TierConfig | undefined {
  return TIERS.find((t) => t.priceId === priceId)
}

export function getTierById(id: TierId): TierConfig | undefined {
  return TIERS.find((t) => t.id === id)
}
