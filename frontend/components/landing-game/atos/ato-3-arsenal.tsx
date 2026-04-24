'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { CONTADORES, MODULOS } from '@/lib/game/modulos'
import { useGameStore } from '@/lib/game/store'
import { ContadorSlot } from '../arsenal/contador-slot'
import { CardModulo } from '../arsenal/card-modulo'

interface Ato3ArsenalProps {
  onEntrar?: () => void
  onAvancar: () => void
  somAtivo: boolean
}

const GRID_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export function Ato3Arsenal({ onEntrar, onAvancar, somAtivo }: Ato3ArsenalProps) {
  const [contadoresAtivos, setContadoresAtivos] = useState(false)
  const gridContadoresRef = useRef<HTMLDivElement | null>(null)
  const entrouRef = useRef(false)
  const nomeOperador = useGameStore((s) => s.nomeOperador)
  const nomeSaudacao = nomeOperador ? nomeOperador.split(' ')[0].toLowerCase() : 'operador'

  // Feedback de entrada: dispara uma vez quando o componente monta.
  // O AtoWrapper só renderiza Ato 3 quando atoAtual === 3, então mount = entrada.
  useEffect(() => {
    if (entrouRef.current) return
    entrouRef.current = true
    onEntrar?.()
  }, [onEntrar])

  useEffect(() => {
    const el = gridContadoresRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setContadoresAtivos(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] px-4 py-16 md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.12),transparent_55%)]"
      />

      <div className="max-w-6xl mx-auto">
        <header className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] text-neon-cyan border border-cyan-500/30 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
            ato 3/5 · arsenal desbloqueado
          </div>
          <h2
            id="ato-3-titulo"
            className="font-orbitron font-bold text-3xl md:text-4xl text-zinc-50 leading-tight"
          >
            coleta o que você precisa,{' '}
            <span className="text-neon-cyan neon-text-cyan">{nomeSaudacao}.</span>
          </h2>
          <p className="mt-4 text-zinc-400 font-exo2 text-base md:text-lg">
            cada ferramenta que fica pra trás{' '}
            <span className="text-zinc-200">é uma oportunidade perdida.</span>
          </p>
        </header>

        <div
          ref={gridContadoresRef}
          className="flex flex-wrap justify-center gap-x-8 gap-y-10 md:gap-x-12 mb-16 md:mb-24"
        >
          {CONTADORES.map((c) => (
            <ContadorSlot
              key={c.id}
              contador={c}
              ativar={contadoresAtivos}
            />
          ))}
        </div>

        <motion.div
          variants={GRID_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-16"
        >
          {MODULOS.map((modulo) => (
            <motion.div key={modulo.id} variants={CARD_VARIANTS}>
              <CardModulo modulo={modulo} somAtivo={somAtivo} />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onAvancar}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-orbitron font-bold uppercase tracking-wider text-base md:text-lg shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.65)] transition-shadow min-h-[56px]"
            aria-label="ver leaderboard — avançar pro ato 4"
          >
            <ChevronDown className="w-5 h-5" aria-hidden />
            ver o leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}
