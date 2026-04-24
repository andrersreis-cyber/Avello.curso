'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { Leaderboard } from '../leaderboard/leaderboard'
import { useGameStore } from '@/lib/game/store'
import { formatarXp } from '@/lib/game/leaderboard'

interface Ato4LeaderboardProps {
  onEntrar: () => void
  onAvancar: () => void
  somAtivo: boolean
}

export function Ato4Leaderboard({ onEntrar, onAvancar }: Ato4LeaderboardProps) {
  const xpTotal = useGameStore((s) => s.xpTotal)
  const jaEntrouRef = useRef(false)

  useEffect(() => {
    if (jaEntrouRef.current) return
    jaEntrouRef.current = true
    onEntrar()
  }, [onEntrar])

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] px-4 py-16 md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.08),transparent_55%)]"
      />

      <div className="max-w-6xl mx-auto">
        <header className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] text-neon-cyan border border-cyan-500/30 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            ato 4/5 · leaderboard
          </div>
          <h2
            id="ato-4-titulo"
            className="font-orbitron font-bold text-3xl md:text-4xl text-zinc-50 leading-tight"
          >
            leaderboard ·{' '}
            <span className="text-neon-cyan neon-text-cyan">últimos 90 dias.</span>
          </h2>
          <p className="mt-4 text-zinc-400 font-exo2 text-base md:text-lg">
            ranking real. prova clicável.
          </p>
        </header>

        <Leaderboard />

        <div className="max-w-xl mx-auto mt-12 mb-10 md:mt-16 md:mb-14">
          <div className="h-3 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-green-500 transition-all duration-700"
              style={{ width: '80%' }}
              aria-hidden
            />
          </div>
          <p className="mt-3 text-center font-hud text-xs uppercase tracking-[0.2em] text-zinc-400">
            xp total: <span className="text-neon-cyan tabular-nums">{formatarXp(xpTotal)}</span> · falta 1 missão
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onAvancar}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-orbitron font-bold uppercase tracking-wider text-base md:text-lg shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.65)] active:scale-95 transition-all min-h-[56px] cursor-pointer"
            aria-label="ativar meu arsenal — avançar pro ato 5"
          >
            <ChevronDown className="w-5 h-5" aria-hidden />
            ativar meu arsenal
          </button>
        </div>
      </div>
    </div>
  )
}
