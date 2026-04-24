'use client'

import { useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Plus } from 'lucide-react'
import { BadgeRaridade } from './badge-raridade'
import { ICONES_MODULO, type Modulo, type Raridade } from '@/lib/game/modulos'
import { playSfx } from '@/lib/game/sounds'

interface CardModuloProps {
  modulo: Modulo
  somAtivo: boolean
  coletado: boolean
  onColetar: (el: HTMLElement) => void
}

const BORDA_POR_RARIDADE: Record<Raridade, string> = {
  comum: 'border-zinc-700 hover:border-zinc-500',
  rara: 'border-cyan-500/40 hover:border-cyan-400',
  epica: 'border-fuchsia-500/40 hover:border-fuchsia-400',
  lendaria: 'border-cyan-500/50 hover:border-cyan-300 shadow-[0_0_24px_rgba(217,70,239,0.18)]',
}

const GLOW_POR_RARIDADE: Record<Raridade, string> = {
  comum: 'hover:shadow-[0_0_24px_rgba(113,113,122,0.3)]',
  rara: 'hover:shadow-[0_0_32px_rgba(6,182,212,0.35)]',
  epica: 'hover:shadow-[0_0_32px_rgba(217,70,239,0.35)]',
  lendaria: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.35)]',
}

/**
 * Card do Arsenal. Sem flip 3D — interação simples:
 * - estado "disponível": card info + botão [coletar]
 * - estado "coletado": overlay dourado por cima (permanente)
 *
 * A troca é por CSS + Framer Motion fade/scale, não rotação.
 * Mais acessível, mais previsível, funciona 100% no mobile.
 */
export function CardModulo({ modulo, somAtivo, coletado, onColetar }: CardModuloProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)

  const Icon = ICONES_MODULO[modulo.iconeKey]

  const handleColetar = useCallback(() => {
    if (coletado) return
    playSfx('loot', somAtivo)
    if (cardRef.current) onColetar(cardRef.current)
  }, [coletado, onColetar, somAtivo])

  return (
    <div
      ref={cardRef}
      className={`relative w-full h-[240px] rounded-xl border bg-zinc-900/80 transition-all duration-300 ${BORDA_POR_RARIDADE[modulo.raridade]} ${
        coletado ? 'opacity-95' : GLOW_POR_RARIDADE[modulo.raridade]
      }`}
    >
      {/* Conteúdo do card */}
      <div className="absolute inset-0 p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <Icon
            className={
              modulo.raridade === 'lendaria'
                ? 'w-10 h-10 text-fuchsia-300'
                : 'w-10 h-10 text-neon-cyan'
            }
            aria-hidden
          />
          <BadgeRaridade raridade={modulo.raridade} />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <h3 className="font-orbitron font-semibold text-lg text-zinc-50">
            {modulo.nome}
          </h3>
          <p className="text-sm text-zinc-400 font-exo2 leading-snug">
            {modulo.descricao}
          </p>
        </div>

        <button
          type="button"
          onClick={handleColetar}
          disabled={coletado}
          aria-label={
            coletado ? `${modulo.nome} já coletado` : `coletar ${modulo.nome}`
          }
          className={`inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg font-hud text-xs uppercase tracking-[0.15em] transition-all min-h-[40px] ${
            coletado
              ? 'bg-amber-500/10 border border-amber-500/40 text-amber-300 cursor-default'
              : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/50 text-neon-cyan hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-400 cursor-pointer active:scale-95'
          }`}
        >
          {coletado ? (
            <>
              <Check className="w-3.5 h-3.5" aria-hidden />
              coletado
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" aria-hidden />
              coletar · +50 xp
            </>
          )}
        </button>
      </div>

      {/* Overlay dourado quando coletado — fade suave */}
      {coletado && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl border-2 border-amber-500/60 shadow-[0_0_32px_rgba(251,191,36,0.25)]"
          style={{
            background:
              'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, transparent 50%, rgba(251,191,36,0.12) 100%)',
          }}
        >
          {/* Stamp "COLETADO" no canto */}
          <div className="absolute top-3 left-3 font-hud text-[9px] uppercase tracking-[0.2em] text-amber-400 border border-amber-500/50 rounded px-1.5 py-0.5 bg-amber-500/10">
            ✓ coletado
          </div>
        </motion.div>
      )}
    </div>
  )
}
