'use client'

import { Zap } from 'lucide-react'
import type { ClasseNivel, Nivel } from '@/lib/game/levels'

interface NivelBadgeProps {
  nivel: Nivel | null
  classe: ClasseNivel | null
}

/**
 * Badge do nível/classe do operador no HUD.
 * Mobile (< sm): só "⚡" (sem nível) ou "⚡ NV 2" (com nível) — ecnomia de espaço.
 * Desktop (sm+): mostra classe completa.
 */
export function NivelBadge({ nivel, classe }: NivelBadgeProps) {
  if (!nivel || !classe) {
    return (
      <div
        className="flex items-center gap-1.5 text-neon-cyan"
        aria-label="operador"
      >
        <Zap className="w-3.5 h-3.5 shrink-0" aria-hidden />
        <span className="hidden sm:inline font-hud text-[11px] uppercase tracking-wider">
          operador
        </span>
      </div>
    )
  }
  return (
    <div
      className="flex items-center gap-1.5 text-neon-cyan"
      aria-label={`nível ${nivel}, ${classe}`}
    >
      <Zap className="w-3.5 h-3.5 shrink-0" aria-hidden />
      <span className="font-hud text-[11px] uppercase tracking-wider whitespace-nowrap">
        nv {nivel}
        <span className="hidden sm:inline">
          {' '}· <span className="text-zinc-300">{classe.toLowerCase()}</span>
        </span>
      </span>
    </div>
  )
}
