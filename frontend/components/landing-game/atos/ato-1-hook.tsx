'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Gift, Target, Users } from 'lucide-react'
import { GlitchText } from '../shared/glitch-text'

interface Ato1HookProps {
  onAvancar: () => void
}

const FADE_UP = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function Ato1Hook({ onAvancar }: Ato1HookProps) {
  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] flex items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(217,70,239,0.12),transparent_55%)]"
      />

      <div className="max-w-3xl w-full text-center">
        <motion.div
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] text-neon-cyan border border-cyan-500/30 rounded-full px-3 py-1 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          jornada interativa · ato 1/5
        </motion.div>

        <GlitchText
          as="h1"
          className="font-orbitron font-bold tracking-tight leading-[1.05] text-zinc-50 neon-text-cyan"
        >
          <span
            className="block"
            style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}
          >
            o que acontece quando
          </span>
          <span
            className="block mt-2 bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(2.25rem, 7.5vw, 5rem)' }}
          >
            14 mil ferramentas de ia
          </span>
          <span
            className="block mt-2"
            style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}
          >
            trabalham <em className="not-italic text-neon-green">pra você</em>?
          </span>
        </GlitchText>

        <motion.p
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-base md:text-lg text-zinc-400 leading-relaxed font-exo2"
        >
          jornada interativa. sem cadastro. sem cartão.
          <br />
          <span className="text-zinc-500">começa quando você decidir.</span>
        </motion.p>

        <motion.div
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <button
            type="button"
            onClick={onAvancar}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-orbitron font-bold uppercase tracking-wider text-base md:text-lg shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.65)] transition-shadow min-h-[56px]"
            aria-label="começar jornada — ato 1 de 5"
          >
            <span aria-hidden>▶</span>
            começar jornada
            <ChevronRight
              className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              aria-hidden
            />
          </button>

          <p className="font-hud text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            som ativado ao iniciar · pode mutar no topo
          </p>
        </motion.div>

        <motion.ul
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-hud text-zinc-500 uppercase tracking-wider"
        >
          <li className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neon-cyan" aria-hidden />
            800+ operadores ativos
          </li>
          <li className="flex items-center gap-2">
            <Target className="w-4 h-4 text-neon-green" aria-hidden />
            3 min de experiência
          </li>
          <li className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-neon-magenta" aria-hidden />
            brinde no final
          </li>
        </motion.ul>
      </div>
    </div>
  )
}
