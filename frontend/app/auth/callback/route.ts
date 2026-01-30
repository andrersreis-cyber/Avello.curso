'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

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
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Ignore errors in Server Components
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Verificar se usuário já tem perfil, se não, criar um
      const { data: existingProfile } = await supabase
        .from('usuarios')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!existingProfile) {
        // Criar perfil do usuário
        await supabase.from('usuarios').insert({
          id: data.user.id,
          email: data.user.email!,
          nome: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
          plano: 'free',
        })
      }
    }
  }

  // Redirecionar para a página principal após login
  return NextResponse.redirect(`${origin}/`)
}
