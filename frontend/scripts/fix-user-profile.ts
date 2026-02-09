/**
 * Script para corrigir perfil de usuário
 * Cria registro na tabela usuarios se não existir
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixUserProfile(userId: string, email: string, nome: string, plano: 'free' | 'premium' = 'premium') {
  console.log(`🔧 Corrigindo perfil do usuário ${email}...`)
  
  // Verificar se já existe
  const { data: existing } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (existing) {
    console.log('✅ Usuário já existe:', existing)
    
    // Atualizar para premium
    const { data: updated, error: updateError } = await supabase
      .from('usuarios')
      .update({ 
        plano,
        premium_since: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
    
    if (updateError) {
      console.error('❌ Erro ao atualizar:', updateError)
    } else {
      console.log('✅ Usuário atualizado para premium:', updated)
    }
    
    return
  }
  
  // Criar novo registro
  const { data, error } = await supabase
    .from('usuarios')
    .insert({
      id: userId,
      email,
      nome,
      plano,
      premium_since: plano === 'premium' ? new Date().toISOString() : null
    })
    .select()
  
  if (error) {
    console.error('❌ Erro ao criar usuário:', error)
  } else {
    console.log('✅ Usuário criado com sucesso:', data)
  }
}

// Executar
const userId = '19e78305-f4e7-414e-8437-69d20a4f78f0'
const email = 'teste@avello.com'
const nome = 'Usuário Teste'

fixUserProfile(userId, email, nome, 'premium')
  .then(() => {
    console.log('✅ Script concluído!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
