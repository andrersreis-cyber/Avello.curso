'use client'

import Image from 'next/image'
import { LogOut, Users, ShoppingBag, Heart, HelpCircle, Search, Sparkles, LogIn, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

type HeaderProps = {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, profile, signOut, loading, isPremium } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/login'
  }

  const getUserInitial = () => {
    if (profile?.nome) return profile.nome.charAt(0).toUpperCase()
    if (user?.email) return user.email.charAt(0).toUpperCase()
    return 'U'
  }

  const getUserName = () => {
    if (profile?.nome) return profile.nome.split(' ')[0]
    if (user?.email) return user.email.split('@')[0]
    return 'Usuário'
  }

  return (
    <header className="h-16 bg-zinc-900 border-b border-zinc-700 flex items-center justify-between px-3 sm:px-6 relative overflow-hidden">
      {/* Background Pattern - mais sutil */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, rgba(14, 165, 233, 0.2) 0%, transparent 50%)`
        }} />
      </div>

      {/* Left: Menu + Logo */}
      <div className="flex items-center gap-2 sm:gap-4 relative z-10">
        {/* Botão Menu Mobile */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
          <div className="relative hidden sm:block w-10 h-10">
            <Image 
              src="/images/logo-avello.png" 
              alt="Avello" 
              width={40}
              height={40}
              className="object-contain rounded-lg transition-transform group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-cyan-400">
              AVELLO
            </span>
            <span className="text-[9px] sm:text-[10px] text-zinc-400 -mt-1 tracking-wider">
              PREMIUM ACCESS
            </span>
          </div>
        </Link>

        {/* Divider - hidden on mobile */}
        <div className="hidden sm:block h-8 w-px bg-zinc-700 ml-2" />

        {/* Quick Search - hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-cyan-500/50 transition-colors group">
          <Search className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar recursos..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-40"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-zinc-400 bg-zinc-700 rounded">
            ⌘K
          </kbd>
        </div>
      </div>
      
      {/* Right: Navigation */}
      <div className="flex items-center gap-1 relative z-10">
        {/* Navigation links - hidden on mobile (available in drawer) */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink href="/comunidade" icon={<Users className="w-4 h-4" />} label="Comunidade" />
          <NavLink href="/loja" icon={<ShoppingBag className="w-4 h-4" />} label="Loja" highlight />
          <NavLink href="/afiliados" icon={<Heart className="w-4 h-4" />} label="Afiliados" />
          <NavLink href="/suporte" icon={<HelpCircle className="w-4 h-4" />} label="Suporte" />

          {/* Divider */}
          <div className="h-8 w-px bg-zinc-700 mx-2" />
        </div>

        {/* Mobile quick links */}
        <div className="flex lg:hidden items-center gap-1">
          <Link href="/comunidade" className="p-1.5 text-zinc-400 hover:text-white rounded-lg">
            <Users className="w-4 h-4" />
          </Link>
          <Link href="/afiliados" className="p-1.5 text-zinc-400 hover:text-white rounded-lg">
            <Heart className="w-4 h-4" />
          </Link>
          <Link href="/suporte" className="p-1.5 text-zinc-400 hover:text-white rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </Link>
        </div>

        {user ? (
          <>
            {/* User Menu */}
            <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 ml-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors group border border-zinc-700">
              <div className={cn(
                "w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center",
                isPremium 
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600" 
                  : "bg-zinc-600"
              )}>
                <span className="text-xs font-bold text-white">{getUserInitial()}</span>
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm text-white">{getUserName()}</span>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  {isPremium ? (
                    <>
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      Premium
                    </>
                  ) : (
                    'Plano Starter'
                  )}
                </span>
              </div>
            </button>

            {/* Logout */}
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-1 sm:gap-2 p-1.5 sm:px-3 sm:py-2 text-zinc-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Sair</span>
            </button>
          </>
        ) : (
          <>
            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Entrar</span>
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/cadastro"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all ml-1"
            >
              <span className="text-xs sm:text-sm">Criar Conta</span>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

function NavLink({ 
  href,
  icon, 
  label, 
  highlight 
}: { 
  href: string
  icon: React.ReactNode
  label: string
  highlight?: boolean 
}) {
  return (
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm",
        highlight 
          ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50"
          : "text-zinc-300 hover:text-white hover:bg-zinc-800"
      )}
    >
      {icon}
      <span className="hidden lg:inline">{label}</span>
    </Link>
  )
}
