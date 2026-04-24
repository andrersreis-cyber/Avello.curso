'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Trophy } from 'lucide-react'

interface AchievementToastProps {
  label: string | null
  onDismiss?: () => void
}

export function AchievementToast({ label, onDismiss }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {label && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          onAnimationComplete={() => {
            if (label && onDismiss) {
              window.setTimeout(onDismiss, 2400)
            }
          }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-zinc-900/90 backdrop-blur-md px-4 py-3 neon-glow-cyan"
        >
          <Trophy className="w-5 h-5 text-neon-cyan" aria-hidden />
          <div className="font-hud text-xs uppercase tracking-wider text-zinc-400">
            conquista desbloqueada
          </div>
          <div className="text-sm font-semibold text-zinc-50">{label}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
