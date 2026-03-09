'use client'

import { X, Zap, Crown, ArrowLeft } from 'lucide-react'
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
            Desbloqueie todos os 6.000+ recursos. Um único projeto paga o Premium inteiro.
          </p>

          {/* Preço */}
          <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
            <div className="text-3xl font-bold text-white">
              R$ 39<span className="text-lg text-zinc-400">/ano</span>
            </div>
            <p className="text-cyan-400 text-sm mt-1">Apenas R$ 3,25/mês</p>
            <p className="text-zinc-500 text-xs mt-2">Um projeto de R$250 já paga o ano inteiro</p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              href="/loja"
              className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all"
            >
              <Zap className="w-5 h-5" />
              Fazer Upgrade
            </Link>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-medium transition-all border border-zinc-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          </div>

          <p className="text-xs text-zinc-500 mt-4">
            Garantia de 7 dias ou seu dinheiro de volta
          </p>
        </div>
      </div>
    </div>
  )
}
