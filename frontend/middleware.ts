import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  // Rotas públicas (não precisam de autenticação)
  const publicRoutes = ['/login', '/cadastro', '/escolher-plano', '/oferta-especial', '/landing', '/jornada', '/api', '/auth', '/recuperar-senha', '/redefinir-senha', '/termos', '/privacidade', '/completar-cadastro', '/obrigado']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Se não está logado
  if (!session) {
    // Se está na raiz, redirecionar para landing
    if (request.nextUrl.pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/landing'
      return NextResponse.redirect(url)
    }
    
    // Se tenta acessar rota protegida, redireciona para login
    if (!isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Se está logado
  if (session) {
    // Se tenta acessar login/cadastro/landing, redireciona para home
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/cadastro' || request.nextUrl.pathname === '/landing' || request.nextUrl.pathname === '/jornada') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Verificar se plano é 'pendente' — redirecionar para /escolher-plano
    const allowedForPendente = ['/escolher-plano', '/oferta-especial', '/api', '/auth', '/loja/sucesso']
    const isAllowedRoute = allowedForPendente.some(route => request.nextUrl.pathname.startsWith(route))

    if (!isAllowedRoute) {
      const { data: perfil } = await supabase
        .from('usuarios')
        .select('plano')
        .eq('id', session.user.id)
        .single()

      if (perfil?.plano === 'pendente') {
        const url = request.nextUrl.clone()
        url.pathname = '/escolher-plano'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|ogg|m4a|woff|woff2|ttf)$).*)',
  ],
}
