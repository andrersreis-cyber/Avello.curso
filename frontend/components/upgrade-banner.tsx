'use client'

import Link from 'next/link'
import { Zap, X } from 'lucide-react'
import { useState } from 'react'

type UpgradeBannerProps = {
  moduleName?: string
  templateCount?: number
  limit?: number
}

export function UpgradeBanner({ moduleName, templateCount, limit }: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  // Mensagem contextual
  let message = 'Desbloqueie todos os 6.000+ recursos por R$ 3,25/mês'

  if (limit && templateCount !== undefined && templateCount >= limit) {
    message = `Você atingiu o limite de ${limit} templates. Desbloqueie +2.480 por apenas +R$24/ano`
  } else if (moduleName) {
    message = `"${moduleName}" é um módulo Premium. Desbloqueie por R$ 3,25/mês`
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm text-zinc-300 flex-1">
          <Zap className="w-4 h-4 text-cyan-400 inline mr-1.5" />
          {message}
        </p>
        <Link
          href="/loja"
          className="shrink-0 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Fazer Upgrade
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 text-zinc-500 hover:text-white transition-colors"
          aria-label="Fechar banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
