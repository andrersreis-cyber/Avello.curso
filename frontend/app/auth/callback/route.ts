'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  // Criar resposta de redirecionamento
  const redirectUrl = new URL('/', origin)
  const response = NextResponse.redirect(redirectUrl)

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
                // Garantir que cookies sejam setados na resposta também
                response.cookies.set(name, value, options)
              })
            } catch {
              // Ignore errors in Server Components
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Verificar se usuário já tem perfil e telefone
      const { data: existingProfile } = await supabase
        .from('usuarios')
        .select('id, telefone')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Criar perfil via API route (usa service role, ignora RLS)
        try {
          await fetch(`${origin}/api/fix-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: data.user.id,
              email: data.user.email!,
              nome: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
              plano: 'starter',
            }),
          })
        } catch (err) {
          console.error('❌ Erro ao criar perfil via API:', err)
        }
        
        // Redirecionar para completar cadastro (telefone obrigatório)
        return NextResponse.redirect(new URL('/completar-cadastro', origin))
      }
      
      // Se perfil existe mas não tem telefone, redirecionar para completar cadastro
      if (!existingProfile.telefone) {
        return NextResponse.redirect(new URL('/completar-cadastro', origin))
      }
    }
  }

  return response
}
