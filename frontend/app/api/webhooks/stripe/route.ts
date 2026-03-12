import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe-server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Desabilitar o body parser padrão para webhooks
export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  
  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura não encontrada' },
      { status: 400 }
    )
  }
  
  let event: Stripe.Event
  
  try {
    // Em produção, você deve configurar STRIPE_WEBHOOK_SECRET
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      // Para desenvolvimento, aceitar sem verificação
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (error: any) {
    console.error('Erro ao verificar webhook:', error.message)
    return NextResponse.json(
      { error: `Webhook error: ${error.message}` },
      { status: 400 }
    )
  }
  
  // Processar eventos
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✅ Pagamento concluído:', session.id)
        console.log('   Cliente:', session.customer_email)
        console.log('   Produto:', session.metadata?.productId)
        console.log('   Afiliado:', session.metadata?.affiliateCode)
        
        // Processa comissão do afiliado se houver código
        const affiliateCode = session.metadata?.affiliateCode
        if (affiliateCode) {
          await processAffiliateCommission(
            affiliateCode,
            session.id,
            session.amount_total || 0,
            session.customer_email || ''
          )
        }
        
        // Atualizar usuário para premium com data de início
        if (session.customer_email) {
          const now = new Date().toISOString()
          
          // Buscar usuário pelo email
          const { data: usuario } = await supabase
            .from('usuarios')
            .select('id')
            .eq('email', session.customer_email)
            .single()
          
          if (usuario) {
            // Determinar plano baseado no produto comprado
            const productId = session.metadata?.productId
            let plano: 'starter' | 'premium' | 'premium_pro' = 'premium'

            if (productId === 'starter') {
              plano = 'starter'
            } else if (productId === 'pack_premium') {
              plano = 'premium_pro'
            }

            await supabase
              .from('usuarios')
              .update({
                plano,
                premium_since: now
              })
              .eq('id', usuario.id)

            console.log(`✅ Usuário ${session.customer_email} atualizado para ${plano}`)
          } else {
            console.log(`⚠️ Usuário não encontrado: ${session.customer_email}`)
          }
        }
        
        break
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('📅 Nova assinatura:', subscription.id)
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('🔄 Assinatura atualizada:', subscription.id, subscription.status)
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('❌ Assinatura cancelada:', subscription.id)
        const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id
        if (customerId) {
          try {
            const customer = await stripe.customers.retrieve(customerId)
            const email = customer.deleted ? null : (customer as Stripe.Customer).email
            if (email) {
              const { data: usuario } = await supabase
                .from('usuarios')
                .select('id')
                .eq('email', email)
                .single()
              if (usuario) {
                await supabase
                  .from('usuarios')
                  .update({ plano: 'pendente', premium_since: null })
                  .eq('id', usuario.id)
                console.log(`✅ Acesso revogado para ${email}`)
              } else {
                console.log(`⚠️ Usuário não encontrado: ${email}`)
              }
            }
          } catch (err) {
            console.error('❌ Erro ao revogar acesso:', err)
          }
        }
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('💰 Pagamento de fatura:', invoice.id)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('⚠️ Falha no pagamento:', invoice.id)
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
        if (customerId) {
          try {
            const customer = await stripe.customers.retrieve(customerId)
            const email = customer.deleted ? null : (customer as Stripe.Customer).email
            if (email) {
              const { data: usuario } = await supabase
                .from('usuarios')
                .select('id')
                .eq('email', email)
                .single()
              if (usuario) {
                console.log(`⚠️ Falha de pagamento para usuário: ${email}`)
              }
            }
          } catch (err) {
            console.error('❌ Erro ao processar invoice.payment_failed:', err)
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('⏰ Checkout abandonado:', session.id)
        console.log('   Email:', session.customer_email)
        console.log('   Produto:', session.metadata?.productId)

        // Enviar para n8n para sequência de recuperação
        if (session.customer_email) {
          const { data: usuario } = await supabase
            .from('usuarios')
            .select('nome, telefone')
            .eq('email', session.customer_email)
            .single()

          const webhookData = {
            email: session.customer_email,
            nome: usuario?.nome || '',
            telefone: usuario?.telefone || '',
            productId: session.metadata?.productId || 'lowtik',
            valor: (session.amount_total || 0) / 100,
            sessionId: session.id,
            abandonedAt: new Date().toISOString(),
          }

          try {
            await fetch('https://n8nwebhook.agenteflowia.com/webhook/checkout_abandonado', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(webhookData),
            })
            console.log('✅ Dados de abandono enviados para n8n')
          } catch (err) {
            console.error('❌ Erro ao enviar para n8n:', err)
          }
        }

        break
      }
      
      default:
        console.log(`Evento não tratado: ${event.type}`)
    }
    
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro ao processar evento' },
      { status: 500 }
    )
  }
}

/**
 * Processa a comissão do afiliado após uma venda
 */
async function processAffiliateCommission(
  affiliateCode: string,
  orderId: string,
  amountTotal: number, // em centavos
  customerEmail: string
) {
  try {
    // Busca o afiliado pelo código
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id, comissao_percentual, total_vendas, total_comissao')
      .eq('codigo', affiliateCode.toUpperCase())
      .eq('status', 'active')
      .single()
    
    if (affiliateError || !affiliate) {
      console.log('⚠️ Afiliado não encontrado:', affiliateCode)
      return
    }
    
    // Calcula a comissão (valor em reais)
    const valorVenda = amountTotal / 100
    const percentualComissao = affiliate.comissao_percentual || 30
    const valorComissao = (valorVenda * percentualComissao) / 100
    
    // Cria registro de referral
    const { data: referral } = await supabase
      .from('referrals')
      .insert({
        affiliate_id: affiliate.id,
        referred_email: customerEmail,
        status: 'converted',
        converted_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    // Cria registro de comissão
    await supabase.from('commissions').insert({
      affiliate_id: affiliate.id,
      referral_id: referral?.id,
      order_id: orderId,
      valor_venda: valorVenda,
      percentual_comissao: percentualComissao,
      valor_comissao: valorComissao,
      status: 'pending' // Fica pendente até passar o período de garantia
    })
    
    // Atualiza totais do afiliado
    await supabase
      .from('affiliates')
      .update({
        total_vendas: (affiliate.total_vendas || 0) + 1,
        total_comissao: (affiliate.total_comissao || 0) + valorComissao
      })
      .eq('id', affiliate.id)
    
    console.log(`💰 Comissão registrada: R$ ${valorComissao.toFixed(2)} para afiliado ${affiliateCode}`)
  } catch (error) {
    console.error('Erro ao processar comissão do afiliado:', error)
  }
}
