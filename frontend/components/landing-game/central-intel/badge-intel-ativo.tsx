'use client'

import { PROXIMA_TRANSMISSAO_DIAS } from '@/lib/game/intel-feed'

interface BadgeIntelAtivoProps {
  className?: string
  compact?: boolean
}

export function BadgeIntelAtivo({ className = '', compact = false }: BadgeIntelAtivoProps) {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-hud text-[10px] uppercase tracking-[0.18em] text-red-400 ${className}`}
        aria-label="intel ativo · transmissões semanais"
      >
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        intel ativo
      </span>
    )
  }

  return (
    <div
      className={`inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] text-red-400 border border-red-500/40 rounded-full px-3 py-1 bg-red-500/5 ${className}`}
      aria-label={`intel ativo · próxima transmissão em ${PROXIMA_TRANSMISSAO_DIAS} dias`}
    >
      <span className="relative inline-flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      intel ativo · próxima em {PROXIMA_TRANSMISSAO_DIAS} dias
    </div>
  )
}
