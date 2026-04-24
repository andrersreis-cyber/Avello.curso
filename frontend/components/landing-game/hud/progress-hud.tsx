'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { NivelBadge } from './nivel-badge'
import { SomToggle } from './som-toggle'
import { BadgeIntelAtivo } from '../central-intel/badge-intel-ativo'
import { formatarXp } from '@/lib/game/leaderboard'
import type { ClasseNivel, Nivel } from '@/lib/game/levels'

interface ProgressHudProps {
  progresso: number
  nivel: Nivel | null
  classe: ClasseNivel | null
  somAtivo: boolean
  xpTotal: number
  onToggleSom: () => void
}

export function ProgressHud({
  progresso,
  nivel,
  classe,
  somAtivo,
  xpTotal,
  onToggleSom,
}: ProgressHudProps) {
  const progressoClamp = Math.max(0, Math.min(100, progresso))

  return (
    <header
      role="banner"
      className="fixed top-0 inset-x-0 z-50 h-14 border-b border-zinc-800/80 backdrop-blur-md bg-hud-bg"
    >
      <div className="max-w-6xl mx-auto h-full px-4 md:px-6 flex items-center gap-3 md:gap-5">
        <div className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo-avello.png"
            alt="avello"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="font-orbitron text-sm font-bold text-neon-cyan neon-text-cyan hidden sm:inline">
            AVELLO
          </span>
        </div>

        <div className="hidden sm:block h-5 w-px bg-zinc-800" aria-hidden />

        <div className="shrink-0">
          <NivelBadge nivel={nivel} classe={classe} />
        </div>

        <div
          className="flex-1 h-2 min-w-[60px] rounded-full bg-zinc-800/80 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressoClamp}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="progresso da jornada"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            initial={false}
            animate={{ width: `${progressoClamp}%` }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <span
          className="font-hud text-[11px] uppercase tracking-wider text-zinc-400 tabular-nums shrink-0"
          aria-hidden
        >
          {progressoClamp}%
        </span>

        <motion.div
          id="hud-xp-target"
          className="inline-flex items-center gap-1 sm:gap-1.5 font-hud text-[10px] sm:text-[11px] uppercase tracking-wider text-neon-cyan tabular-nums shrink-0 border border-cyan-500/25 rounded-full px-2 sm:px-2.5 py-0.5 bg-cyan-500/5"
          key={xpTotal}
          initial={false}
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-label={`xp total: ${xpTotal}`}
        >
          <Zap className="w-3 h-3" aria-hidden />
          <span className="tabular-nums">{formatarXp(xpTotal)}</span>
          <span className="hidden sm:inline">xp</span>
        </motion.div>

        <div className="hidden lg:flex shrink-0">
          <BadgeIntelAtivo compact />
        </div>

        <SomToggle ativo={somAtivo} onToggle={onToggleSom} />
      </div>
    </header>
  )
}
