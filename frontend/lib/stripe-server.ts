import Stripe from 'stripe'

/**
 * Cliente Stripe server-side.
 *
 * Modo de operação controlado pela env STRIPE_MODE:
 * - STRIPE_MODE=test  → usa STRIPE_SECRET_KEY_TEST (cartão 4242 funciona)
 * - STRIPE_MODE=live  → usa STRIPE_SECRET_KEY (padrão, cartões reais)
 *
 * Se STRIPE_MODE não for 'test', assume live.
 */
export const STRIPE_MODE = (process.env.STRIPE_MODE || 'live').toLowerCase() === 'test' ? 'test' : 'live'

const secretKey =
  STRIPE_MODE === 'test' && process.env.STRIPE_SECRET_KEY_TEST
    ? process.env.STRIPE_SECRET_KEY_TEST
    : process.env.STRIPE_SECRET_KEY

export const stripe = new Stripe(secretKey!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

export const STRIPE_WEBHOOK_SECRET =
  STRIPE_MODE === 'test' && process.env.STRIPE_WEBHOOK_SECRET_TEST
    ? process.env.STRIPE_WEBHOOK_SECRET_TEST
    : process.env.STRIPE_WEBHOOK_SECRET
