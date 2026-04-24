#!/usr/bin/env node
/**
 * Teste end-to-end do fluxo de ativação pós-compra.
 *
 * Simula cada etapa que acontece em produção:
 * 1. Webhook: cria auth user sem senha + row em `usuarios` com plano premium
 * 2. Ativar-conta: atualiza senha via admin.updateUserById
 * 3. Cliente: login com senha via signInWithPassword
 * 4. Limpeza: deleta user de teste
 *
 * Usage:
 *   node scripts/testar-fluxo-ativacao.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')

const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')]
    }),
)

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Admin (service role) para simular webhook + ativação
const admin = createClient(supabaseUrl, serviceRoleKey)

// Cliente (anon key) para simular login do usuário
const client = createClient(supabaseUrl, anonKey)

const timestamp = Date.now()
const emailTeste = `teste-ativacao-${timestamp}@digitalavello.shop`
const senhaTeste = `TesteSenha123!${timestamp}`

const step = (n, label) => console.log(`\n${'='.repeat(3)} ${n}. ${label} ${'='.repeat(3)}`)
const ok = (msg) => console.log(`   ✅ ${msg}`)
const fail = (msg) => console.log(`   ❌ ${msg}`)

async function main() {
  console.log(`\n🧪 Teste end-to-end do fluxo de ativação`)
  console.log(`   Email: ${emailTeste}`)
  console.log(`   Senha: ${senhaTeste}`)

  let userId = null

  try {
    // ─────────────────────────────────────────────────────────
    step(1, 'WEBHOOK: cria auth user silencioso (sem senha)')
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: emailTeste,
      email_confirm: true,
      user_metadata: {
        source: 'stripe_checkout',
        productId: 'operador_anual',
      },
    })
    if (createError) {
      fail(`admin.createUser falhou: ${createError.message}`)
      return
    }
    userId = created.user.id
    ok(`auth user criado: ${userId}`)

    // ─────────────────────────────────────────────────────────
    step(2, 'WEBHOOK: insere row em `usuarios` com plano premium')
    const now = new Date().toISOString()
    const { error: insertError } = await admin.from('usuarios').insert({
      id: userId,
      email: emailTeste,
      nome: emailTeste.split('@')[0],
      plano: 'premium',
      premium_since: now,
    })
    if (insertError) {
      fail(`insert em usuarios falhou: ${insertError.message}`)
      return
    }
    ok('row em usuarios criada com plano=premium')

    // ─────────────────────────────────────────────────────────
    step(3, 'CLIENTE: tenta logar SEM senha definida (deve falhar)')
    const { error: semSenha } = await client.auth.signInWithPassword({
      email: emailTeste,
      password: senhaTeste,
    })
    if (semSenha) {
      ok(`login bloqueado como esperado: ${semSenha.message}`)
    } else {
      fail('login FUNCIONOU sem senha definida — isso é um problema!')
    }

    // ─────────────────────────────────────────────────────────
    step(4, 'ATIVAR-CONTA: define senha via admin.updateUserById')
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      password: senhaTeste,
    })
    if (updateError) {
      fail(`updateUserById falhou: ${updateError.message}`)
      return
    }
    ok('senha definida')

    // ─────────────────────────────────────────────────────────
    step(5, 'CLIENTE: login com senha recém criada')
    const { data: session, error: loginError } = await client.auth.signInWithPassword({
      email: emailTeste,
      password: senhaTeste,
    })
    if (loginError) {
      fail(`login falhou: ${loginError.message}`)
    } else if (!session?.session) {
      fail('login retornou sem session')
    } else {
      ok(`login ok — access_token: ${session.session.access_token.slice(0, 20)}...`)
    }

    // ─────────────────────────────────────────────────────────
    step(6, 'CLIENTE: consulta seu perfil em `usuarios`')
    const { data: perfil, error: perfilError } = await client
      .from('usuarios')
      .select('id, email, plano, premium_since')
      .eq('id', userId)
      .single()
    if (perfilError) {
      fail(`consulta perfil falhou: ${perfilError.message}`)
    } else {
      ok(`perfil acessível: plano=${perfil.plano}, premium_since=${perfil.premium_since?.slice(0, 19)}`)
    }

    // ─────────────────────────────────────────────────────────
    step(7, 'LIMPEZA: deleta user de teste')
    await client.auth.signOut()
    const { error: deleteRowError } = await admin.from('usuarios').delete().eq('id', userId)
    if (deleteRowError) fail(`delete usuarios: ${deleteRowError.message}`)
    else ok('row em usuarios removida')

    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(userId)
    if (deleteAuthError) fail(`delete auth: ${deleteAuthError.message}`)
    else ok('auth user removido')

    console.log('\n🎉 TESTE COMPLETO — fluxo de ativação funciona ponta a ponta.\n')
  } catch (err) {
    fail(`exceção inesperada: ${err.message}`)
    console.error(err)

    // Tenta limpar mesmo após erro
    if (userId) {
      await admin.from('usuarios').delete().eq('id', userId)
      await admin.auth.admin.deleteUser(userId).catch(() => {})
      console.log('   (tentativa de limpeza executada)')
    }
  }
}

main()
