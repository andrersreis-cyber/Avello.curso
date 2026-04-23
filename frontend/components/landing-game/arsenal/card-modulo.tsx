'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { BadgeRaridade } from './badge-raridade'
import { ICONES_MODULO, type Modulo, type Raridade, type Tier } from '@/lib/game/modulos'
import { playSfx } from '@/lib/game/sounds'

interface CardModuloProps {
  modulo: Modulo
  somAtivo: boolean
  onFlip?: () => void
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

const VERSO_GRADIENT: Record<Raridade, string> = {
  comum: 'bg-zinc-900/90',
  rara: 'bg-gradient-to-br from-zinc-900 to-cyan-950/40',
  epica: 'bg-gradient-to-br from-zinc-900 to-fuchsia-950/40',
  lendaria: 'bg-gradient-to-br from-cyan-950/50 via-zinc-900 to-fuchsia-950/50',
}

/**
 * Observa prefers-reduced-motion via useSyncExternalStore — pattern oficial
 * do React 18+ pra subscrever a stores externos (matchMedia, localStorage, etc.).
 * Evita chamar matchMedia em cada render e não dispara o lint de sync-set-state.
 */
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
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  )
}

export function CardModulo({ modulo, somAtivo, onFlip }: CardModuloProps) {
  const [flipped, setFlipped] = useState(false)
  const [fadeReduced, setFadeReduced] = useState(false)
  const containerRef = useRef<HTMLButtonElement | null>(null)
  const temTouchRef = useRef(false)
  const autoFlipFeitoRef = useRef(false)
  const reduced = usePrefereReducedMotion()

  const Icon = ICONES_MODULO[modulo.iconeKey]

  const disparaFlip = useCallback(
    (next: boolean) => {
      setFlipped(next)
      if (next) {
        if (reduced) {
          setFadeReduced(true)
          window.setTimeout(() => setFadeReduced(false), 600)
        }
        playSfx('loot', somAtivo)
        onFlip?.()
      }
    },
    [onFlip, somAtivo, reduced],
  )

  useEffect(() => {
    temTouchRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none)').matches
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || !temTouchRef.current || autoFlipFeitoRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !autoFlipFeitoRef.current) {
            autoFlipFeitoRef.current = true
            disparaFlip(true)
            window.setTimeout(() => setFlipped(false), 900)
          }
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [disparaFlip])

  const handleMouseEnter = () => {
    if (temTouchRef.current) return
    disparaFlip(true)
  }
  const handleMouseLeave = () => {
    if (temTouchRef.current) return
    setFlipped(false)
  }
  const handleClick = () => {
    disparaFlip(!flipped)
  }

  return (
    <button
      ref={containerRef}
      type="button"
      aria-label={`módulo ${modulo.nome} — ver detalhes`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: reduced ? undefined : '1000px' }}
      className={`relative w-full h-[220px] text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-xl ${
        reduced && fadeReduced ? 'opacity-70' : 'opacity-100'
      } transition-opacity`}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: reduced ? 'flat' : 'preserve-3d',
          transform: !reduced && flipped ? 'rotateY(180deg)' : undefined,
          transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div
          className={`absolute inset-0 rounded-xl border bg-zinc-900/80 p-5 flex flex-col gap-3 ${BORDA_POR_RARIDADE[modulo.raridade]}`}
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

          <div className="mt-auto">
            <span
              className={`inline-flex items-center font-hud text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border ${TIER_CLASS[modulo.tier]}`}
            >
              {modulo.tier === 'free' ? 'free' : 'premium'}
            </span>
          </div>
        </div>

        {!reduced && (
          <div
            className={`absolute inset-0 rounded-xl border ${BORDA_POR_RARIDADE[modulo.raridade]} ${VERSO_GRADIENT[modulo.raridade]} p-5 flex flex-col items-center justify-center gap-3 text-center`}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CheckCircle2 className="w-14 h-14 text-neon-green" aria-hidden />
            <span className="font-orbitron font-bold text-xl text-neon-green neon-text-green">
              DESBLOQUEADO
            </span>
            <span className="text-sm text-zinc-400 font-exo2">
              arsenal liberado pra você
            </span>
          </div>
        )}
      </div>
    </button>
  )
}
