'use client'

import { Clock, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'

type TimeLockedModuleProps = {
  moduleName: string
  daysRemaining: number
}

export function TimeLockedModule({ moduleName, daysRemaining }: TimeLockedModuleProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      {/* Ícone animado */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <Clock className="w-12 h-12 text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Título */}
      <h2 className="text-2xl font-bold text-white mb-3">
        Conteúdo em Período de Garantia
      </h2>

      {/* Descrição */}
      <p className="text-zinc-400 max-w-md mb-6">
        O módulo <span className="text-white font-semibold">{moduleName}</span> faz parte do conteúdo exclusivo 
        que será liberado após o período de garantia de 7 dias.
      </p>

      {/* Contador */}
      <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 mb-8">
        <p className="text-sm text-zinc-500 mb-2">Liberação em</p>
        <div className="flex items-center justify-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl px-6 py-4">
            <span className="text-4xl font-bold text-white">{daysRemaining}</span>
          </div>
          <span className="text-xl text-zinc-400">
            {daysRemaining === 1 ? 'dia' : 'dias'}
          </span>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 max-w-md mb-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm text-amber-300 font-medium mb-1">
              Por que existe esse período?
            </p>
            <p className="text-xs text-zinc-400">
              O período de 7 dias permite que você conheça a plataforma e garante 
              sua satisfação. Após esse prazo, todo o conteúdo exclusivo será liberado automaticamente.
            </p>
          </div>
        </div>
      </div>

      {/* Botão para explorar outros módulos */}
      <Link 
        href="/"
        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
      >
        Explorar outros módulos disponíveis →
      </Link>
    </div>
  )
}
