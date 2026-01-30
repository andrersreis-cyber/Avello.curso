import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { products, ProductId, STRIPE_PRICE_IDS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { productId, affiliateCode } = await request.json()
    
    if (!productId || !products[productId as ProductId]) {
      return NextResponse.json(
        { error: 'Produto inválido' },
        { status: 400 }
      )
    }
    
    const product = products[productId as ProductId]
    const priceId = STRIPE_PRICE_IDS[productId as keyof typeof STRIPE_PRICE_IDS]
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Preço não configurado para este produto' },
        { status: 400 }
      )
    }
    
    // Configuração da sessão usando Price ID fixo
    const sessionConfig: any = {
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      success_url: `${origin}/loja/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/loja?canceled=true`,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        productId: product.id,
        affiliateCode: affiliateCode || '',
      },
    }
    
    // Define o modo baseado no tipo de produto
    if (product.type === 'subscription') {
      sessionConfig.mode = 'subscription'
    } else {
      sessionConfig.mode = 'payment'
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig)
    
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
