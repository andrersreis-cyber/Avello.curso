'use client'

import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-browser'

type UserProfile = {
  id: string
  email: string
  nome: string
  telefone?: string | null
  plano: 'free' | 'premium'
  premium_since?: string | null
  created_at: string
}

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, nome: string, telefone: string) => Promise<{ error: Error | null }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<UserProfile | null> // Revalidar perfil e retornar o perfil atualizado
  isPremium: boolean
  hasFullAccess: boolean // Premium há mais de 7 dias (conteúdo exclusivo liberado)
  daysUntilFullAccess: number // Dias restantes para acesso total
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  // Buscar perfil do usuário (apenas campos necessários)
  const fetchProfile = async (userId: string) => {
    console.log('🔍 Buscando perfil para userId:', userId)
    const { data, error } = await supabase
      .from('usuarios')
      .select('id,email,nome,telefone,plano,premium_since,created_at')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('❌ Erro ao buscar perfil:', error)
      return null
    }
    
    console.log('✅ Perfil carregado:', data)
    return data as UserProfile
  }

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id)
        setProfile(userProfile)
      }
      
      setLoading(false)
    }

    getSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userProfile = await fetchProfile(session.user.id)
          setProfile(userProfile)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error as Error | null }
  }

  const signUp = async (email: string, password: string, nome: string, telefone: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          nome,
          full_name: nome,
          telefone,
        },
      },
    })

    if (!error && data.user) {
      // Criar perfil via API route (usa service role, ignora RLS)
      try {
        await fetch('/api/fix-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            email,
            nome,
            telefone,
            plano: 'free',
          }),
        })
      } catch (err) {
        console.error('❌ Erro ao criar perfil via API:', err)
      }
    }

    return { error: error as Error | null }
  }

  const signInWithGoogle = async () => {
    // Sempre usar window.location.origin para garantir redirect correto
    const siteUrl = window.location.origin
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  // Método para revalidar perfil manualmente (após pagamento, etc)
  const refreshProfile = async (): Promise<UserProfile | null> => {
    if (!user) {
      console.log('⚠️ Não há usuário logado para revalidar')
      return null
    }
    
    console.log('🔄 Revalidando perfil do usuário...')
    const userProfile = await fetchProfile(user.id)
    setProfile(userProfile)
    console.log('✅ Perfil revalidado:', userProfile)
    return userProfile
  }

  // Calcular se tem acesso total (premium há mais de 7 dias) - memoizado
  const { hasFullAccess, daysRemaining } = useMemo(() => {
    if (profile?.plano !== 'premium') return { hasFullAccess: false, daysRemaining: 0 }
    
    if (!profile.premium_since) {
      // Se não tem data, considera que tem acesso total (usuário antigo)
      return { hasFullAccess: true, daysRemaining: 0 }
    }
    
    const premiumDate = new Date(profile.premium_since)
    const now = new Date()
    const diffTime = now.getTime() - premiumDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays >= 7) {
      return { hasFullAccess: true, daysRemaining: 0 }
    }
    
    return { hasFullAccess: false, daysRemaining: 7 - diffDays }
  }, [profile?.plano, profile?.premium_since])

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    refreshProfile, // ← NOVO
    isPremium: profile?.plano === 'premium',
    hasFullAccess,
    daysUntilFullAccess: daysRemaining,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
