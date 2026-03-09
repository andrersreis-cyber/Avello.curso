import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, email, nome, telefone, plano } = await request.json()
    
    console.log('🔧 Corrigindo perfil:', { userId, email, nome, telefone, plano })
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (existing) {
      // Atualizar — preserva plano existente se não fornecido
      const plan = plano ?? existing.plano ?? 'starter'
      const updateData: any = { 
        plano: plan,
        premium_since: (plan === 'premium' || plan === 'premium_pro') ? new Date().toISOString() : existing.premium_since
      }
      
      // Adicionar telefone se fornecido
      if (telefone) {
        updateData.telefone = telefone
      }
      
      const { data, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', userId)
        .select()
      
      if (error) throw error
      
      return NextResponse.json({ 
        success: true, 
        message: 'Usuário atualizado',
        data 
      })
    }
    
    // Criar novo
    const plan = plano || 'pendente'
    const insertData: any = {
      id: userId,
      email,
      nome,
      plano: plan,
      premium_since: (plan === 'premium' || plan === 'premium_pro') ? new Date().toISOString() : null
    }
    
    // Adicionar telefone se fornecido
    if (telefone) {
      insertData.telefone = telefone
    }
    
    const { data, error } = await supabase
      .from('usuarios')
      .insert(insertData)
      .select()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true, 
      message: 'Usuário criado',
      data 
    })
    
  } catch (error: any) {
    console.error('❌ Erro:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
