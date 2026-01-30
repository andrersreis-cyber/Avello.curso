import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { code, referrer, landingPage } = await request.json()
    
    if (!code) {
      return NextResponse.json({ error: 'Código não fornecido' }, { status: 400 })
    }
    
    // Busca o afiliado pelo código
    const { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('id')
      .eq('codigo', code.toUpperCase())
      .eq('status', 'active')
      .single()
    
    if (affiliateError || !affiliate) {
      // Código de afiliado inválido, mas não retorna erro para não expor informação
      return NextResponse.json({ success: true })
    }
    
    // Obtém IP do usuário
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    // Registra o clique
    await supabase.from('affiliate_clicks').insert({
      affiliate_id: affiliate.id,
      ip_address: ip,
      user_agent: request.headers.get('user-agent'),
      referrer_url: referrer,
      landing_page: landingPage
    })
    
    // Atualiza contador de cliques do afiliado (incremento manual)
    const { data: currentData } = await supabase
      .from('affiliates')
      .select('total_cliques')
      .eq('id', affiliate.id)
      .single()
    
    if (currentData) {
      await supabase
        .from('affiliates')
        .update({ total_cliques: (currentData.total_cliques || 0) + 1 })
        .eq('id', affiliate.id)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao registrar clique:', error)
    return NextResponse.json({ success: true }) // Não expõe erro
  }
}
