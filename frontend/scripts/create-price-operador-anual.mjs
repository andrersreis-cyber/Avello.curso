#!/usr/bin/env node
/**
 * Cria (uma única vez) o Product + Price "Operador Completo" no Stripe
 * com valor de R$ 59,99/ano pra ser consumido pela landing gameficada.
 *
 * Uso: node scripts/create-price-operador-anual.mjs
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function loadEnv(path) {
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split('\n')
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => {
        const [k, ...v] = l.split('=')
        return [k.trim(), v.join('=').trim().replace(/^["']|["']$/g, '')]
      }),
  )
}

const env = loadEnv(resolve(ROOT, '.env.local'))
const SK = env.STRIPE_SECRET_KEY

if (!SK) {
  console.error('[x] STRIPE_SECRET_KEY ausente no .env.local')
  process.exit(1)
}

async function stripePost(path, params) {
  const body = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&')
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SK}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} em ${path}: ${JSON.stringify(json.error || json)}`)
  }
  return json
}

async function main() {
  const modo = SK.startsWith('sk_live_') ? 'LIVE' : 'TEST'
  console.log(`[*] conectando no Stripe (${modo})...`)
  console.log('')

  console.log('[*] criando Product "Operador Completo" + Price R$ 59,99/ano...')
  const product = await stripePost('products', {
    name: 'Operador Completo',
    description:
      'Acesso anual ao arsenal Avello: 14 mil ferramentas IA, 9 módulos, 30 SaaS white label.',
    'metadata[source]': 'landing-gameficada',
    'default_price_data[unit_amount]': '5999',
    'default_price_data[currency]': 'brl',
    'default_price_data[recurring][interval]': 'year',
  })

  console.log('')
  console.log('[v] criado com sucesso:')
  console.log(`    product.id      = ${product.id}`)
  console.log(`    default_price   = ${product.default_price}`)
  console.log(`    valor           = R$ 59,99/ano (5999 centavos)`)
  console.log(`    modo            = ${modo}`)
  console.log('')
  console.log('[>] adicionar em frontend/lib/stripe.ts:')
  console.log('    STRIPE_PRICE_IDS.operador_anual = \'' + product.default_price + '\'')
  console.log('    products.operador_anual = { id, name, price: 5999, type: \'subscription\', interval: \'year\', ... }')
}

main().catch((err) => {
  console.error('[x] falhou:', err.message)
  process.exit(1)
})
