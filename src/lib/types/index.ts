export interface Profile {
  id: string
  email: string
  name: string | null
  stripe_customer_id: string | null
  tier: 'free' | 'pro' | 'enterprise'
  ai_credits: number
  credits_reset_at: string | null
}

export interface Generation {
  id: string
  user_id: string
  prompt: string
  response: string
  model: string
  tokens: number
  created_at: string
}

export type Tier = 'free' | 'pro' | 'enterprise'
