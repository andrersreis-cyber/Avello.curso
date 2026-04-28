import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { products, ProductId, STRIPE_PRICE_IDS } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { productId, affiliateCode, customerEmail, source } = await request.json()

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

    // Landing gameficada (lead não logado) → página /obrigado com instrução de email
    // Dashboard (user logado via /escolher-plano) → /loja/sucesso com polling
    const successPath =
      source === 'landing'
        ? `/obrigado?session_id={CHECKOUT_SESSION_ID}`
        : `/loja/sucesso?session_id={CHECKOUT_SESSION_ID}`
    const cancelPath =
      source === 'landing' ? `/landing` : `/oferta-especial?plano=${productId}`

    const isOneTime = product.type !== 'subscription'

    const sessionConfig: any = {
      // PIX será adicionado após ativação completa no Stripe Dashboard
      // (dashboard.stripe.com/account/payments/settings → PIX → Ativar)
      payment_method_types: ['card'],
      // Endereço obrigatório só para cartão; PIX não precisa
      billing_address_collection: isOneTime ? 'auto' : 'required',
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`,
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      metadata: {
        productId: product.id,
        affiliateCode: affiliateCode || '',
        source: source || 'dashboard',
      },
    }

    // Pré-preenche o email do usuário logado para garantir que o webhook encontre o registro
    if (customerEmail && typeof customerEmail === 'string') {
      sessionConfig.customer_email = customerEmail
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
