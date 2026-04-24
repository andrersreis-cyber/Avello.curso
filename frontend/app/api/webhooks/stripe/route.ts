import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe-server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Desabilitar o body parser padrão para webhooks
export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

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
    // Usa o secret do mode ativo (test ou live) — vindo de lib/stripe-server
    const webhookSecret = STRIPE_WEBHOOK_SECRET

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
        devLog('✅ Pagamento concluído:', session.id)
        devLog('   Cliente:', session.customer_email)
        devLog('   Produto:', session.metadata?.productId)
        devLog('   Afiliado:', session.metadata?.affiliateCode)

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

        // Provisionar acesso: cria user auto + envia magic link se necessário
        const rawEmail = session.customer_email
        if (rawEmail) {
          const email = rawEmail.toLowerCase().trim()
          const now = new Date().toISOString()
          const productId = session.metadata?.productId

          // Determinar plano baseado no produto comprado
          let plano: 'starter' | 'premium' | 'premium_pro' = 'premium'
          if (productId === 'starter') plano = 'starter'
          else if (productId === 'pack_premium') plano = 'premium_pro'

          try {
            await provisionarAcesso(email, plano, now, productId)
          } catch (err) {
            console.error('❌ Erro ao provisionar acesso:', err)
          }
        } else {
          devLog('⚠️ customer_email ausente na session — impossível provisionar acesso')
        }

        break
      }
      
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        devLog('📅 Nova assinatura:', subscription.id)
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        devLog('🔄 Assinatura atualizada:', subscription.id, subscription.status)
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        devLog('❌ Assinatura cancelada:', subscription.id)
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
                devLog(`✅ Acesso revogado para ${email}`)
              } else {
                devLog(`⚠️ Usuário não encontrado: ${email}`)
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
        devLog('💰 Pagamento de fatura:', invoice.id)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        devLog('⚠️ Falha no pagamento:', invoice.id)
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
                devLog(`⚠️ Falha de pagamento para usuário: ${email}`)
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
        devLog('⏰ Checkout abandonado:', session.id)
        devLog('   Email:', session.customer_email)
        devLog('   Produto:', session.metadata?.productId)

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
            const n8nBase = process.env.N8N_WEBHOOK_BASE_URL || 'https://n8nwebhook.agenteflowia.com'
            await fetch(`${n8nBase}/webhook/checkout_abandonado`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(webhookData),
            })
            devLog('✅ Dados de abandono enviados para n8n')
          } catch (err) {
            console.error('❌ Erro ao enviar para n8n:', err)
          }
        }

        break
      }
      
      default:
        devLog(`Evento não tratado: ${event.type}`)
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
 * Provisiona acesso após compra bem-sucedida (SILENCIOSO — não envia emails).
 *
 * O lead completa o cadastro (senha) na página /obrigado via /api/ativar-conta.
 * Este webhook só garante que:
 * - auth user existe (criado sem senha, email_confirm=true)
 * - row em `usuarios` existe com plano correto
 *
 * Se lead fecha a aba antes de definir senha, ele pode ir em /login e
 * usar "esqueci senha" que o fluxo recovery do Supabase funciona.
 */
async function provisionarAcesso(
  email: string,
  plano: 'starter' | 'premium' | 'premium_pro',
  now: string,
  productId?: string,
) {
  // 1. Usuário já tem perfil? Só atualiza
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email)
    .single()

  if (usuario) {
    await supabase
      .from('usuarios')
      .update({ plano, premium_since: now })
      .eq('id', usuario.id)
    devLog(`✅ Usuário ${email} atualizado para ${plano}`)
    return
  }

  // 2. Busca ou cria user em auth.users
  let authUserId: string | undefined

  // Tenta achar user existente em auth.users (pode ter se cadastrado antes)
  const { data: list } = await supabase.auth.admin.listUsers()
  authUserId = list?.users?.find((u) => u.email?.toLowerCase() === email)?.id

  if (!authUserId) {
    // Cria user silenciosamente — SEM senha, email já confirmado.
    // A senha é definida pelo lead na página /obrigado (via /api/ativar-conta).
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { source: 'stripe_checkout', productId: productId ?? 'unknown' },
    })
    if (createError) {
      console.error('❌ Erro ao criar auth user:', createError.message)
      return
    }
    authUserId = created?.user?.id
    devLog(`👤 Auth user criado: ${email}`)
  }

  if (!authUserId) {
    console.error(`❌ Não foi possível obter authUserId para ${email}`)
    return
  }

  // 3. Cria row em `usuarios` com plano correto
  const { error: insertError } = await supabase.from('usuarios').insert({
    id: authUserId,
    email,
    nome: email.split('@')[0],
    plano,
    premium_since: now,
  })

  if (insertError) {
    if (insertError.code === '23505') {
      // Race condition — row já existe, só atualiza
      await supabase
        .from('usuarios')
        .update({ plano, premium_since: now })
        .eq('id', authUserId)
      devLog(`✅ Race condition: ${email} atualizado para ${plano}`)
    } else {
      console.error('❌ Erro ao inserir usuário:', insertError.message)
    }
  } else {
    devLog(`✅ Perfil criado para ${email} com plano ${plano}`)
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
      devLog('⚠️ Afiliado não encontrado:', affiliateCode)
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
    
    devLog(`💰 Comissão registrada: R$ ${valorComissao.toFixed(2)} para afiliado ${affiliateCode}`)
  } catch (error) {
    console.error('Erro ao processar comissão do afiliado:', error)
  }
}
