import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { products, ProductId, STRIPE_PRICE_IDS } from '@/lib/stripe'

// IDs dos cupons criados no Stripe (Task 7)
const COUPONS: Record<string, string> = {
  starter: 'VOLTA10_STARTER',
  lowtik: 'VOLTA10_PREMIUM',
  operador_anual: 'OFERTA39_OPERADOR',
}

export async function POST(request: NextRequest) {
  try {
    const { productId, affiliateCode, customerEmail } = await request.json()

    if (!productId || !products[productId as ProductId]) {
      return NextResponse.json({ error: 'Produto inválido' }, { status: 400 })
    }

    const product = products[productId as ProductId]
    const priceId = STRIPE_PRICE_IDS[productId as keyof typeof STRIPE_PRICE_IDS]
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const couponId = COUPONS[productId] || null

    if (!priceId) {
      return NextResponse.json({ error: 'Preço não configurado' }, { status: 400 })
    }

    const sessionConfig: any = {
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      success_url: `${origin}/loja/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/loja`,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        productId: product.id,
        affiliateCode: affiliateCode || '',
        ofertaEspecial: 'true',
      },
    }

    if (couponId) {
      sessionConfig.discounts = [{ coupon: couponId }]
    }

    if (customerEmail && typeof customerEmail === 'string') {
      sessionConfig.customer_email = customerEmail
    }

    sessionConfig.mode = product.type === 'subscription' ? 'subscription' : 'payment'

    const session = await stripe.checkout.sessions.create(sessionConfig)
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erro checkout desconto:', error)
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 })
  }
}
