'use client'

import { X, Zap, Check, Crown } from 'lucide-react'
import Link from 'next/link'

type UpgradeModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-2xl border border-zinc-700 max-w-md w-full overflow-hidden">
        {/* Header gradient */}
        <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Conteúdo Premium
          </h2>
          <p className="text-zinc-400 mb-6">
            Este recurso está disponível apenas para membros Premium. Faça upgrade e desbloqueie todos os recursos!
          </p>

          {/* Preço */}
          <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-zinc-500 line-through">R$ 199</span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">80% OFF</span>
            </div>
            <div className="text-3xl font-bold text-white">
              R$ 39<span className="text-lg text-zinc-400">/ano</span>
            </div>
            <p className="text-cyan-400 text-sm mt-1">Apenas R$ 3,25/mês</p>
          </div>

          {/* Benefícios */}
          <div className="text-left space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-zinc-300 text-sm">+3500 Prompts ChatGPT</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-zinc-300 text-sm">+3500 Prompts Midjourney</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-zinc-300 text-sm">+3000 Templates Typebot</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-zinc-300 text-sm">+58 Super Fluxos de IA</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-zinc-300 text-sm">+30 SaaS White Label</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-zinc-300 text-sm">E muito mais...</span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/loja"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all"
          >
            <Zap className="w-5 h-5" />
            Fazer Upgrade Agora
          </Link>

          <p className="text-xs text-zinc-500 mt-4">
            Garantia de 7 dias ou seu dinheiro de volta
          </p>
        </div>
      </div>
    </div>
  )
}
