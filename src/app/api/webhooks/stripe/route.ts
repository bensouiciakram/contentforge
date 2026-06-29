import type Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createStripeClient } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTierByPriceId, getTierById } from '@/features/billing/lib/config'

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    const stripe = createStripeClient()
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('processed_events')
      .select('id')
      .eq('id', event.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ received: true })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id

        if (!userId) {
          console.error('Missing client_reference_id in checkout session')
          break
        }

        const retrieved = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items', 'subscription'],
        })

        const priceId = retrieved.line_items?.data[0]?.price?.id
        if (!priceId) break

        const tier = getTierByPriceId(priceId)
        if (!tier) break

        const customerId = session.customer as string
        let creditsResetAt: string | undefined

        const subscriptionId = typeof retrieved.subscription === 'string'
          ? retrieved.subscription
          : (retrieved.subscription as any)?.id

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const periodEnd = (subscription as any).current_period_end
          if (periodEnd) {
            creditsResetAt = new Date(periodEnd * 1000).toISOString()
          }
        }

        await supabase.from('profiles').update({
          tier: tier.id,
          ai_credits: tier.credits,
          stripe_customer_id: customerId,
          ...(creditsResetAt ? { credits_reset_at: creditsResetAt } : {}),
        }).eq('id', userId)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, tier')
          .eq('stripe_customer_id', customerId)
          .maybeSingle()

        if (!profile) break

        if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
          const freeTier = getTierById('free')
          await supabase.from('profiles').update({
            tier: 'free',
            ai_credits: freeTier!.credits,
            credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }).eq('id', profile.id)
          break
        }

        if (subscription.status === 'past_due' || subscription.status === 'incomplete') {
          await supabase.from('profiles').update({
            ai_credits: 0,
          }).eq('id', profile.id)
          break
        }

        const priceId = subscription.items?.data[0]?.price?.id
        if (!priceId) break

        const newTier = getTierByPriceId(priceId)
        if (!newTier) break

        const periodEnd = (subscription as any).current_period_end
        await supabase.from('profiles').update({
          tier: newTier.id,
          ai_credits: newTier.credits,
          ...(periodEnd ? { credits_reset_at: new Date(periodEnd * 1000).toISOString() } : {}),
        }).eq('id', profile.id)

        break
      }

      default:
        break
    }

    await supabase.from('processed_events').insert({ id: event.id })

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
