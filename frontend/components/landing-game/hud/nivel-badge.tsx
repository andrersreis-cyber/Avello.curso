'use client'

import { Zap } from 'lucide-react'
import type { ClasseNivel, Nivel } from '@/lib/game/levels'

interface NivelBadgeProps {
  nivel: Nivel | null
  classe: ClasseNivel | null
}

export function NivelBadge({ nivel, classe }: NivelBadgeProps) {
  if (!nivel || !classe) {
    return (
      <div className="flex items-center gap-1.5 text-neon-cyan">
        <Zap className="w-3.5 h-3.5" aria-hidden />
        <span className="font-hud text-[11px] uppercase tracking-wider">
          operador
        </span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5 text-neon-cyan">
      <Zap className="w-3.5 h-3.5" aria-hidden />
      <span className="font-hud text-[11px] uppercase tracking-wider">
        nv {nivel} · <span className="text-zinc-300">{classe.toLowerCase()}</span>
      </span>
    </div>
  )
}
