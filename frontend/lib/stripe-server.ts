import Stripe from 'stripe'

// Cliente Stripe para o servidor (só usar em API routes)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})
