'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { CheckCircle2, Package, Plus } from 'lucide-react'
import { BadgeRaridade } from './badge-raridade'
import { ICONES_MODULO, type Modulo, type Raridade, type Tier } from '@/lib/game/modulos'
import { playSfx } from '@/lib/game/sounds'

interface CardModuloProps {
  modulo: Modulo
  somAtivo: boolean
  coletado: boolean
  onColetar: (el: HTMLElement) => void
}

const BORDA_POR_RARIDADE: Record<Raridade, string> = {
  comum: 'border-zinc-700',
  rara: 'border-cyan-500/50',
  epica: 'border-fuchsia-500/50',
  lendaria: 'border-cyan-500/50 shadow-[0_0_24px_rgba(217,70,239,0.18)]',
}

const TIER_CLASS: Record<Tier, string> = {
  free: 'text-zinc-500 border-zinc-700 bg-zinc-800',
  premium: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function usePrefereReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)
}

export function CardModulo({ modulo, somAtivo, coletado, onColetar }: CardModuloProps) {
  const [flipped, setFlipped] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const temTouchRef = useRef(false)
  const reduced = usePrefereReducedMotion()

  const Icon = ICONES_MODULO[modulo.iconeKey]

  useEffect(() => {
    temTouchRef.current =
      typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  }, [])

  // Se já tá coletado, fica sempre flipado mostrando o verso dourado.
  const exibeVerso = coletado || (!reduced && flipped)

  const handleMouseEnter = () => {
    if (temTouchRef.current || coletado) return
    setFlipped(true)
  }
  const handleMouseLeave = () => {
    if (temTouchRef.current || coletado) return
    setFlipped(false)
  }

  const handleColetar = useCallback(() => {
    if (coletado) return
    playSfx('loot', somAtivo)
    if (containerRef.current) onColetar(containerRef.current)
  }, [coletado, onColetar, somAtivo])

  const cardLabel = coletado
    ? `${modulo.nome} — já coletado`
    : `coletar ${modulo.nome}`

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[240px] rounded-xl ${
        coletado ? 'opacity-95' : 'opacity-100'
      }`}
      style={{ perspective: reduced ? undefined : '1000px' }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: reduced ? 'flat' : 'preserve-3d',
          transform: !reduced && exibeVerso ? 'rotateY(180deg)' : undefined,
          transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Frente — descoberto, com botão COLETAR */}
        <button
          type="button"
          aria-label={cardLabel}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleColetar}
          disabled={coletado}
          className={`absolute inset-0 rounded-xl border bg-zinc-900/80 p-5 flex flex-col gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${BORDA_POR_RARIDADE[modulo.raridade]} ${
            coletado ? 'cursor-default' : 'cursor-pointer'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
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

          <div className="flex flex-col gap-1">
            <h3 className="font-orbitron font-semibold text-lg text-zinc-50">
              {modulo.nome}
            </h3>
            <p className="text-sm text-zinc-400 font-exo2 leading-snug">
              {modulo.descricao}
            </p>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center font-hud text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border ${TIER_CLASS[modulo.tier]}`}
            >
              {modulo.tier === 'free' ? 'free' : 'premium'}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 font-hud text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-md border border-cyan-500/40 bg-cyan-500/10 text-neon-cyan group-hover:bg-cyan-500/20 ${
                coletado ? 'invisible' : ''
              }`}
              aria-hidden
            >
              <Plus className="w-3 h-3" aria-hidden />
              coletar
            </span>
          </div>
        </button>

        {/* Verso — coletado ou hover flip */}
        {!reduced && (
          <div
            className={`absolute inset-0 rounded-xl border p-5 flex flex-col items-center justify-center gap-3 text-center ${
              coletado
                ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-zinc-900 to-amber-950/40 shadow-[0_0_32px_rgba(251,191,36,0.2)]'
                : BORDA_POR_RARIDADE[modulo.raridade]
            } ${!coletado ? 'bg-zinc-900/90' : ''}`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {coletado ? (
              <>
                <Package className="w-14 h-14 text-amber-300" aria-hidden />
                <span className="font-orbitron font-bold text-xl text-amber-300 uppercase tracking-wider">
                  coletado
                </span>
                <span className="text-sm text-zinc-400 font-exo2">
                  no seu inventário
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-14 h-14 text-neon-green" aria-hidden />
                <span className="font-orbitron font-bold text-xl text-neon-green neon-text-green">
                  clica pra coletar
                </span>
                <span className="text-sm text-zinc-400 font-exo2">
                  +50 xp
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
