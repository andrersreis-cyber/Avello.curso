'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TRANSMISSOES, TIPOS_LABEL, PROXIMA_TRANSMISSAO_DIAS } from '@/lib/game/intel-feed'

export function FeedTerminal() {
  const [linhasVisiveis, setLinhasVisiveis] = useState(0)
  const feedRef = useRef<HTMLDivElement | null>(null)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const el = feedRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (reducedMotionRef.current) {
              setLinhasVisiveis(TRANSMISSOES.length)
              observer.disconnect()
              return
            }

            let i = 0
            const tick = () => {
              i += 1
              setLinhasVisiveis(i)
              if (i < TRANSMISSOES.length) {
                window.setTimeout(tick, 550)
              }
            }
            window.setTimeout(tick, 200)
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
    <div
      ref={feedRef}
      className="relative rounded-xl border border-cyan-500/20 bg-zinc-950/80 shadow-[0_0_60px_rgba(239,68,68,0.06)] overflow-hidden"
      role="region"
      aria-label="feed de transmissões da central de intel"
    >
      {/* Header do terminal (dots macOS + título) */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-2.5 bg-zinc-900/60">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" aria-hidden />
        <span className="ml-3 font-hud text-[10px] uppercase tracking-[0.2em] text-zinc-500">
          central-intel · /feed/transmissoes.log
        </span>
      </div>

      {/* Corpo do feed */}
      <div className="p-4 md:p-6 font-mono text-sm md:text-[15px] leading-relaxed text-terminal min-h-[220px]">
        {TRANSMISSOES.slice(0, linhasVisiveis).map((t, idx) => (
          <motion.div
            key={t.data}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
          >
            <span className="text-zinc-500 select-none">&gt;</span>
            <span className="text-zinc-500 tabular-nums">{t.data}</span>
            <span className="text-zinc-600">·</span>
            <span className="font-hud text-[11px] uppercase tracking-[0.15em] text-neon-cyan">
              {TIPOS_LABEL[t.tipo]}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-green-300">{t.texto}</span>
            {idx === linhasVisiveis - 1 && linhasVisiveis < TRANSMISSOES.length && (
              <span
                className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"
                aria-hidden
              />
            )}
          </motion.div>
        ))}

        {linhasVisiveis === TRANSMISSOES.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-4 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center gap-x-2 gap-y-1"
          >
            <span className="text-zinc-500 select-none">&gt;</span>
            <span className="font-hud text-[11px] uppercase tracking-[0.15em] text-red-400">
              próxima transmissão em {PROXIMA_TRANSMISSAO_DIAS} dias
            </span>
            <span
              className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"
              aria-hidden
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}
