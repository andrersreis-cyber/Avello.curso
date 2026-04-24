'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Lock, Package } from 'lucide-react'
import { CONTADORES, MODULOS } from '@/lib/game/modulos'
import { useGameStore } from '@/lib/game/store'
import { ContadorSlot } from '../arsenal/contador-slot'
import { CardModulo } from '../arsenal/card-modulo'
import { XpParticleLayer } from '../shared/xp-particle'
import { useXpParticles } from '../shared/use-xp-particles'

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

const META_COLETA = 5
const TOTAL_ITENS = MODULOS.length

export function Ato3Arsenal({ onEntrar, onAvancar, somAtivo }: Ato3ArsenalProps) {
  const [contadoresAtivos, setContadoresAtivos] = useState(false)
  const gridContadoresRef = useRef<HTMLDivElement | null>(null)
  const entrouRef = useRef(false)

  const nomeOperador = useGameStore((s) => s.nomeOperador)
  const itensColetados = useGameStore((s) => s.itensColetados)
  const coletarItem = useGameStore((s) => s.coletarItem)

  const nomeSaudacao = nomeOperador
    ? nomeOperador.split(' ')[0].toLowerCase()
    : 'operador'

  const { eventos, dispararXp, removerEvento } = useXpParticles()

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

  const handleColetarModulo = useCallback(
    (moduloId: string, el: HTMLElement) => {
      if (itensColetados.includes(moduloId)) return
      coletarItem(moduloId)
      dispararXp(50, el)
    },
    [coletarItem, dispararXp, itensColetados],
  )

  const qtdColetados = itensColetados.filter((id) =>
    MODULOS.some((m) => m.id === id),
  ).length
  const atingiuMeta = qtdColetados >= META_COLETA
  const progressoColeta = Math.min(100, (qtdColetados / META_COLETA) * 100)

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] px-4 py-16 md:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.12),transparent_55%)]"
      />

      <XpParticleLayer eventos={eventos} onConcluido={removerEvento} />

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
          className="flex flex-wrap justify-center gap-x-8 gap-y-10 md:gap-x-12 mb-12 md:mb-16"
        >
          {CONTADORES.map((c) => (
            <ContadorSlot key={c.id} contador={c} ativar={contadoresAtivos} />
          ))}
        </div>

        {/* Contador de coleta — sticky logo abaixo do HUD */}
        <div className="sticky top-14 z-30 -mx-4 md:mx-0 mb-8">
          <div className="max-w-3xl mx-auto px-4">
            <div className="rounded-xl border border-cyan-500/20 bg-zinc-950/85 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] px-4 py-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                  <Package className="w-3.5 h-3.5 text-neon-cyan" aria-hidden />
                  <span>
                    inventário:{' '}
                    <span className="text-neon-cyan tabular-nums">
                      {qtdColetados}
                    </span>
                    /{TOTAL_ITENS}
                  </span>
                </div>
                {atingiuMeta ? (
                  <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-green-400">
                    ✓ liberado pra avançar
                  </span>
                ) : (
                  <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    meta: {META_COLETA} itens
                  </span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  className={`h-full ${
                    atingiuMeta
                      ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  initial={false}
                  animate={{ width: `${progressoColeta}%` }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </div>
        </div>

        <motion.div
          variants={GRID_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {MODULOS.map((modulo) => (
            <motion.div key={modulo.id} variants={CARD_VARIANTS}>
              <CardModulo
                modulo={modulo}
                somAtivo={somAtivo}
                coletado={itensColetados.includes(modulo.id)}
                onColetar={(el) => handleColetarModulo(modulo.id, el)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onAvancar}
            disabled={!atingiuMeta}
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-orbitron font-bold uppercase tracking-wider text-base md:text-lg min-h-[56px] transition-all ${
              atingiuMeta
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.65)] cursor-pointer active:scale-95'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
            aria-label={
              atingiuMeta
                ? `continuar com ${qtdColetados} de ${TOTAL_ITENS} itens`
                : `coleta pelo menos ${META_COLETA} itens pra avançar`
            }
          >
            {atingiuMeta ? (
              <ChevronDown className="w-5 h-5" aria-hidden />
            ) : (
              <Lock className="w-5 h-5" aria-hidden />
            )}
            {atingiuMeta
              ? `continuar — ${qtdColetados}/${TOTAL_ITENS} coletados`
              : `coleta ${META_COLETA - qtdColetados} item${
                  META_COLETA - qtdColetados === 1 ? '' : 's'
                } pra avançar`}
          </button>

          <button
            type="button"
            onClick={onAvancar}
            className="font-hud text-[11px] uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            aria-label="pular coleta e ir direto pro leaderboard"
          >
            pular —&gt; ver leaderboard direto
          </button>
        </div>
      </div>
    </div>
  )
}
