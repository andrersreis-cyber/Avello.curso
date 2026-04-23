'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { Ato } from '@/lib/game/store'

interface AtoWrapperProps {
  atoId: Ato
  atoAtual: Ato
  children: React.ReactNode
}

/**
 * Gate + wrapper de cada ato. Só renderiza quando `atoAtual === atoId`.
 * Aplica fade + slide discreto na entrada/saída, respeitando reduced-motion
 * via media query global no globals.css.
 */
export function AtoWrapper({ atoId, atoAtual, children }: AtoWrapperProps) {
  const ativo = atoId === atoAtual
  return (
    <AnimatePresence mode="wait">
      {ativo && (
        <motion.section
          key={`ato-${atoId}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full"
          aria-labelledby={`ato-${atoId}-titulo`}
        >
          {children}
        </motion.section>
      )}
    </AnimatePresence>
  )
}
