'use client'

import Link from 'next/link'
import { Lock, Zap, Crown, Sparkles } from 'lucide-react'

type LockedModuleProps = {
  moduleName: string
  moduleIcon?: string
  itemCount?: number
  description?: string
}

export function LockedModule({ 
  moduleName, 
  moduleIcon = '🔒', 
  itemCount,
  description 
}: LockedModuleProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Background Glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative">
            {/* Lock Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 mb-6">
              <Lock className="w-10 h-10 text-zinc-500" />
            </div>

            {/* Module Info */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-3xl mb-2">
                <span>{moduleIcon}</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{moduleName}</h2>
              {itemCount && (
                <p className="text-zinc-400">
                  {itemCount.toLocaleString()} itens disponíveis
                </p>
              )}
              {description && (
                <p className="text-zinc-500 text-sm mt-2">{description}</p>
              )}
            </div>

            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full border border-yellow-500/30 mb-6">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">Conteúdo Premium</span>
            </div>

            {/* Message */}
            <p className="text-zinc-400 mb-8">
              Este módulo está disponível apenas para assinantes Premium.
              <br />
              <span className="text-zinc-500">Faça upgrade para desbloquear todos os recursos.</span>
            </p>

            {/* CTA */}
            <div className="mb-2">
              <span className="text-zinc-500 line-through text-sm">R$ 199/ano</span>
              <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">80% OFF</span>
            </div>
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Fazer Upgrade - R$ 39/ano
            </Link>
            <p className="text-green-400 text-xs mt-2">Preço de lançamento por tempo limitado!</p>

            {/* Benefits */}
            <div className="mt-8 pt-8 border-t border-zinc-800">
              <p className="text-sm text-zinc-500 mb-4">Com o Premium você desbloqueia:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  '+3500 Prompts ChatGPT',
                  '+3500 Prompts Midjourney',
                  '+3000 Templates Typebot',
                  '+14 Mil Ferramentas IA',
                  '+30 SaaS White Label',
                  '+8 Bônus Exclusivos'
                ].map((item, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente menor para usar em cards
 */
export function LockedOverlay() {
  return (
    <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
      <Lock className="w-8 h-8 text-zinc-500 mb-2" />
      <span className="text-sm text-zinc-400 font-medium">Premium</span>
    </div>
  )
}

/**
 * Banner de upgrade para exibir no topo
 */
export function UpgradeBanner() {
  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-b border-cyan-500/20">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-sm text-zinc-300">
            <span className="text-white font-medium">Plano Starter</span> - Faça upgrade para desbloquear todos os recursos
          </span>
        </div>
        <Link
          href="/loja"
          className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm rounded-lg font-medium transition-all"
        >
          <span>R$ 39/ano</span>
        </Link>
      </div>
    </div>
  )
}
