import { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

export const handler: Handler = async (event) => {
  // Apenas aceitar POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    console.log('📥 Webhook recebido: sync-user')

    // Validar autenticação do webhook
    const authHeader = event.headers.authorization
    const expectedAuth = `Bearer ${process.env.SUPABASE_WEBHOOK_SECRET}`

    if (!process.env.SUPABASE_WEBHOOK_SECRET) {
      console.error('❌ SUPABASE_WEBHOOK_SECRET não configurado')
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Webhook secret not configured' }),
      }
    }

    if (authHeader !== expectedAuth) {
      console.error('❌ Autenticação inválida do webhook')
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized' }),
      }
    }

    // Extrair dados do payload
    const payload = JSON.parse(event.body || '{}')
    console.log('📦 Payload recebido:', {
      type: payload.type,
      table: payload.table,
      hasRecord: !!payload.record,
    })

    // Validar estrutura do payload
    if (!payload.record) {
      console.error('❌ Payload inválido: record não encontrado')
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid payload: missing record' }),
      }
    }

    const { record } = payload
    const userId = record.id
    const email = record.email

    if (!userId || !email) {
      console.error('❌ Dados inválidos:', { userId, email })
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid user data: missing id or email' }),
      }
    }

    // Extrair nome do usuário
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

    // Criar cliente Supabase com service role
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
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message, details: error }),
      }
    }

    console.log('✅ Perfil criado com sucesso:', data)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: {
          id: userId,
          email,
          nome: fullName,
        },
      }),
    }
  } catch (error) {
    console.error('❌ Erro no webhook sync-user:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}
