'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

export interface XpEvent {
  id: string
  valor: number
  origemX: number
  origemY: number
}

interface XpParticleLayerProps {
  eventos: XpEvent[]
  onConcluido: (id: string) => void
}

/**
 * Camada de partículas de XP. Recebe eventos (cada um com origem x,y em
 * coordenadas de viewport) e anima uma partícula "+N XP" subindo pro HUD
 * (top-right). Fade-out + scale down ao chegar.
 *
 * Para usar: renderize uma única <XpParticleLayer> na raiz e adicione eventos
 * via estado global ou callback.
 */
export function XpParticleLayer({ eventos, onConcluido }: XpParticleLayerProps) {
  const [mounted, setMounted] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[55]"
    >
      <AnimatePresence>
        {eventos.map((ev) => {
          // Alvo: canto superior direito (onde tá o xpTotal no HUD)
          const alvoX = typeof window !== 'undefined' ? window.innerWidth - 120 : 0
          const alvoY = 28

          const dx = alvoX - ev.origemX
          const dy = alvoY - ev.origemY

          return (
            <motion.div
              key={ev.id}
              initial={{
                opacity: 0,
                scale: 0.6,
                x: ev.origemX,
                y: ev.origemY,
              }}
              animate={
                reducedMotion
                  ? {
                      opacity: [0, 1, 0],
                      x: ev.origemX,
                      y: ev.origemY,
                    }
                  : {
                      opacity: [0, 1, 1, 0],
                      scale: [0.6, 1.15, 1, 0.4],
                      x: [ev.origemX, ev.origemX + dx * 0.4, alvoX],
                      y: [ev.origemY, ev.origemY - 40, alvoY],
                    }
              }
              exit={{ opacity: 0 }}
              transition={{
                duration: reducedMotion ? 0.6 : 1.1,
                ease: [0.22, 1, 0.36, 1],
                times: reducedMotion ? [0, 0.5, 1] : [0, 0.2, 0.65, 1],
              }}
              onAnimationComplete={() => onConcluido(ev.id)}
              className="absolute top-0 left-0 select-none font-orbitron font-bold text-sm md:text-base text-neon-cyan drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            >
              +{ev.valor} XP
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
