import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe-server'

export const runtime = 'nodejs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

/**
 * Ativa a conta do lead após compra bem-sucedida.
 *
 * Fluxo:
 * 1. Recebe session_id (Stripe) + senha + nome opcional
 * 2. Valida session no Stripe:
 *    - payment_status === 'paid'
 *    - extrai customer_email + metadata
 * 3. Busca/cria user em auth.users (o webhook pode já ter criado)
 * 4. Define a senha via admin.updateUserById
 * 5. Retorna { email } pro cliente fazer signInWithPassword
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, senha, nome } = await request.json()

    // Validações básicas
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'session_id ausente' }, { status: 400 })
    }
    if (!senha || typeof senha !== 'string' || senha.length < 6) {
      return NextResponse.json(
        { error: 'senha precisa ter no mínimo 6 caracteres' },
        { status: 400 },
      )
    }

    // 1. Valida session no Stripe (evita fraude)
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'pagamento ainda não foi confirmado. tenta de novo em 1 min.' },
        { status: 402 },
      )
    }

    const email = session.customer_email?.toLowerCase().trim()
    if (!email) {
      return NextResponse.json(
        { error: 'email não encontrado na sessão' },
        { status: 400 },
      )
    }

    const productId = session.metadata?.productId
    let plano: 'starter' | 'premium' | 'premium_pro' = 'premium'
    if (productId === 'starter') plano = 'starter'
    else if (productId === 'pack_premium') plano = 'premium_pro'

    const now = new Date().toISOString()

    // 2. Busca user em auth.users (webhook deveria ter criado)
    const { data: list } = await supabase.auth.admin.listUsers()
    let authUserId = list?.users?.find((u) => u.email?.toLowerCase() === email)?.id

    // Fallback: se webhook ainda não disparou, cria agora
    if (!authUserId) {
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: { source: 'stripe_checkout_activation', productId: productId ?? 'unknown' },
      })
      if (createError || !created?.user) {
        console.error('❌ Erro ao criar user:', createError?.message)
        return NextResponse.json(
          { error: 'não foi possível criar sua conta. contate o suporte.' },
          { status: 500 },
        )
      }
      authUserId = created.user.id
    } else {
      // 3. User já existe — só define senha
      const { error: updateError } = await supabase.auth.admin.updateUserById(authUserId, {
        password: senha,
      })
      if (updateError) {
        console.error('❌ Erro ao definir senha:', updateError.message)
        return NextResponse.json(
          { error: 'não foi possível salvar sua senha. tenta de novo.' },
          { status: 500 },
        )
      }
    }

    // 4. Garante row em `usuarios` (webhook pode ter falhado)
    const { data: perfilExistente } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', authUserId)
      .single()

    if (perfilExistente) {
      const updateData: Record<string, unknown> = { plano, premium_since: now }
      if (nome && typeof nome === 'string' && nome.trim().length > 0) {
        updateData.nome = nome.trim().slice(0, 80)
      }
      await supabase.from('usuarios').update(updateData).eq('id', authUserId)
    } else {
      await supabase.from('usuarios').insert({
        id: authUserId,
        email,
        nome: (nome && typeof nome === 'string' && nome.trim().length > 0
          ? nome.trim().slice(0, 80)
          : email.split('@')[0]),
        plano,
        premium_since: now,
      })
    }

    return NextResponse.json({
      success: true,
      email,
      message: 'conta ativada',
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'erro desconhecido'
    console.error('Erro ao ativar conta:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
