'use client'

import { useEffect, useRef, useState } from 'react'
import type { Contador } from '@/lib/game/modulos'

interface ContadorSlotProps {
  contador: Contador
  ativar: boolean
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function prefereReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ContadorSlot({ contador, ativar }: ContadorSlotProps) {
  const [valor, setValor] = useState(0)
  const frameRef = useRef<number | null>(null)
  const iniciadoRef = useRef(false)

  useEffect(() => {
    if (!ativar || iniciadoRef.current) return
    iniciadoRef.current = true

    const destino = contador.valor

    if (prefereReducedMotion()) {
      frameRef.current = requestAnimationFrame(() => setValor(destino))
      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      }
    }

    const inicio = performance.now()

    const tick = (agora: number) => {
      const decorrido = agora - inicio
      const progresso = Math.min(decorrido / contador.duracaoMs, 1)
      const eased = easeOutCubic(progresso)
      setValor(Math.floor(destino * eased))

      if (progresso < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setValor(destino)
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [ativar, contador.valor, contador.duracaoMs])

  return (
    <div
      className="flex flex-col items-center text-center"
      role="group"
      aria-label={`${contador.valor.toLocaleString('pt-BR')} ${contador.sufixo}`}
    >
      <div className="flex items-baseline">
        <span className="text-neon-cyan text-3xl mr-1 font-orbitron font-bold">
          +
        </span>
        <span className="font-orbitron font-bold text-5xl md:text-6xl text-zinc-50 tabular-nums">
          {valor.toLocaleString('pt-BR')}
        </span>
      </div>
      <span className="mt-2 text-xs md:text-sm text-zinc-400 font-hud uppercase tracking-wider">
        {contador.sufixo}
      </span>
    </div>
  )
}
