#!/usr/bin/env node
/**
 * Diagnóstico rápido do Supabase:
 * - Conta total de auth.users
 * - Últimos 5 users criados
 * - Conta total de rows em `usuarios`
 * - Últimos 5 usuários com seus planos
 * - Orphan detection: auth users sem row em usuarios
 *
 * Usage:
 *   node scripts/checar-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env.local')

// Parse .env.local
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

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Credenciais faltando em .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

const log = (label, value) => console.log(`${label.padEnd(30)} ${value}`)
const sep = () => console.log('─'.repeat(80))

async function main() {
  console.log('\n🔍 Diagnóstico Supabase')
  console.log('URL:', supabaseUrl)
  sep()

  // 1. auth.users
  const { data: authList, error: authError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })
  if (authError) {
    console.error('❌ Erro ao listar auth.users:', authError.message)
    return
  }
  const authUsers = authList?.users || []
  log('Total auth.users:', authUsers.length)

  // Últimos 5 por created_at desc
  const recent = [...authUsers]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
  console.log('\n📅 Últimos 5 auth.users:')
  recent.forEach((u) => {
    const source = u.user_metadata?.source || '-'
    const hasPass = u.encrypted_password ? '✓' : '✗' // só via raw_user (não vem por padrão)
    console.log(`  ${u.created_at.slice(0, 19)} | ${u.email?.padEnd(40) || '?'} | source=${source}`)
  })
  sep()

  // 2. usuarios
  const { count: usuariosCount, error: countError } = await supabase
    .from('usuarios')
    .select('*', { count: 'exact', head: true })
  if (countError) {
    console.error('❌ Erro ao contar usuarios:', countError.message)
  } else {
    log('Total rows em `usuarios`:', usuariosCount || 0)
  }

  const { data: usuariosRecent } = await supabase
    .from('usuarios')
    .select('id, email, plano, premium_since, created_at, nome')
    .order('created_at', { ascending: false })
    .limit(5)

  console.log('\n📅 Últimos 5 em `usuarios`:')
  usuariosRecent?.forEach((u) => {
    console.log(
      `  ${(u.created_at || '').slice(0, 19)} | ${String(u.email).padEnd(40)} | ${String(u.plano).padEnd(15)} | ${u.nome || '-'}`,
    )
  })
  sep()

  // 3. Orphan detection — auth users sem row em usuarios
  const { data: allUsuariosIds } = await supabase.from('usuarios').select('id')
  const usuariosIdSet = new Set((allUsuariosIds || []).map((u) => u.id))
  const orphans = authUsers.filter((u) => !usuariosIdSet.has(u.id))

  console.log('\n🚨 Auth users SEM row em `usuarios` (órfãos):')
  if (orphans.length === 0) {
    console.log('  ✅ Nenhum órfão.')
  } else {
    orphans.slice(0, 10).forEach((u) => {
      console.log(`  ${u.created_at.slice(0, 19)} | ${u.email?.padEnd(40) || '?'} | source=${u.user_metadata?.source || '-'}`)
    })
    if (orphans.length > 10) console.log(`  ... e mais ${orphans.length - 10}`)
  }
  sep()

  // 4. Users com source=stripe_checkout (criados via nosso webhook)
  const stripeUsers = authUsers.filter((u) => u.user_metadata?.source?.includes('stripe'))
  console.log('\n💳 Users criados via Stripe checkout (source=stripe_*):')
  log('Total:', stripeUsers.length)
  stripeUsers
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .forEach((u) => {
      console.log(`  ${u.created_at.slice(0, 19)} | ${u.email?.padEnd(40) || '?'} | ${u.user_metadata?.source}`)
    })

  sep()
  console.log('\n✅ Diagnóstico concluído.\n')
}

main().catch((err) => {
  console.error('Erro inesperado:', err)
  process.exit(1)
})
