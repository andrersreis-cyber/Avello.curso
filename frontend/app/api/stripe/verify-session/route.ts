import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Inicializa o Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Recupera a sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Verifica se o pagamento foi realizado
    if (session.payment_status === 'paid') {
      const productId = session.metadata?.productId || 'lowtik'
      const planoNomes: Record<string, string> = {
        starter: 'Avello Starter',
        lowtik: 'Avello Premium',
        pack_premium: 'Avello Pro',
      }
      return NextResponse.json({
        valid: true,
        amount: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        productId,
        planoNome: planoNomes[productId] || 'Avello Premium',
      })
    } else {
      return NextResponse.json({
        valid: false,
        status: session.payment_status
      })
    }
  } catch (error: any) {
    console.error('Error verifying Stripe session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
