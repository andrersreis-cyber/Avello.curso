'use client'

import { Volume2, VolumeX } from 'lucide-react'

interface SomToggleProps {
  ativo: boolean
  onToggle: () => void
}

export function SomToggle({ ativo, onToggle }: SomToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ativo ? 'desativar som' : 'ativar som'}
      aria-pressed={ativo}
      className="flex items-center justify-center w-9 h-9 rounded-md text-zinc-400 hover:text-neon-cyan hover:bg-zinc-800/60 transition-colors"
    >
      {ativo ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
    </button>
  )
}
