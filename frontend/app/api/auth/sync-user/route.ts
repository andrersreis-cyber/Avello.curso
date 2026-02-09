import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/**
 * Webhook do Supabase para sincronizar perfil de usuário
 * 
 * Este endpoint é chamado automaticamente quando um novo usuário
 * é criado em auth.users via Database Webhook do Supabase.
 * 
 * Configurar webhook no Dashboard:
 * Database → Webhooks → Create a new hook
 * - Table: auth.users
 * - Events: Insert
 * - URL: https://SEU_DOMINIO/api/auth/sync-user
 * - Headers: authorization: Bearer SEU_SECRET
 */
export async function POST(request: Request) {
  try {
    console.log('📥 Webhook recebido: sync-user')

    // Validar autenticação do webhook
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`
    
    if (!process.env.SUPABASE_WEBHOOK_SECRET) {
      console.error('❌ SUPABASE_WEBHOOK_SECRET não configurado')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (authHeader !== expectedAuth) {
      console.error('❌ Autenticação inválida do webhook')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Extrair dados do payload
    const payload = await request.json()
    console.log('📦 Payload recebido:', {
      type: payload.type,
      table: payload.table,
      hasRecord: !!payload.record,
    })

    // Validar estrutura do payload
    if (!payload.record) {
      console.error('❌ Payload inválido: record não encontrado')
      return NextResponse.json(
        { error: 'Invalid payload: missing record' },
        { status: 400 }
      )
    }

    const { record } = payload
    const userId = record.id
    const email = record.email

    if (!userId || !email) {
      console.error('❌ Dados inválidos:', { userId, email })
      return NextResponse.json(
        { error: 'Invalid user data: missing id or email' },
        { status: 400 }
      )
    }

    // Extrair nome do usuário (prioridade: full_name → name → email)
    const fullName = 
      record.raw_user_meta_data?.full_name ||
      record.raw_user_meta_data?.name ||
      email.split('@')[0] ||
      'Usuário'

    console.log('👤 Criando perfil para:', {
      userId,
      email,
      nome: fullName,
    })

    // Criar cliente Supabase com service role (ignora RLS)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Criar perfil do usuário
    const { data, error } = await supabase
      .from('usuarios')
      .upsert(
        {
          id: userId,
          email,
          nome: fullName,
          plano: 'free',
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar perfil:', error)
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      )
    }

    console.log('✅ Perfil criado com sucesso:', data)

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        nome: fullName,
      },
    })
  } catch (error) {
    console.error('❌ Erro no webhook sync-user:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Método GET para verificar se o endpoint está funcionando
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'sync-user',
    message: 'Webhook endpoint is working. Use POST with Supabase webhook payload.',
  })
}
