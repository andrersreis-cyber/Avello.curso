'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface TranscricaoProps {
  linhas: readonly string[]
  duracaoSegundos: number
}

/**
 * Revela as linhas do script conforme o áudio progride.
 * Sincronização aproximada: divide a duração total pelo número de linhas.
 * Sempre que o componente é montado, começa do índice 0 — o parent garante
 * que só existe no DOM enquanto a chamada está ativa.
 */
export function Transcricao({ linhas, duracaoSegundos }: TranscricaoProps) {
  const [indiceAtual, setIndiceAtual] = useState(0)

  useEffect(() => {
    const intervalo = (duracaoSegundos * 1000) / linhas.length
    const timers: number[] = []
    for (let i = 1; i <= linhas.length; i += 1) {
      timers.push(window.setTimeout(() => setIndiceAtual(i), intervalo * i))
    }
    return () => timers.forEach(window.clearTimeout)
  }, [duracaoSegundos, linhas.length])

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="transcrição da ligação do agente 0"
      className="max-h-60 overflow-y-auto pr-1 space-y-2.5 text-left"
    >
      {linhas.map((linha, i) => {
        const revelada = i < indiceAtual
        return (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: revelada ? 1 : 0.2,
            }}
            transition={{ duration: 0.4 }}
            className={`text-sm md:text-base font-exo2 ${
              revelada ? 'text-zinc-100' : 'text-zinc-600'
            }`}
          >
            {linha}
          </motion.p>
        )
      })}
    </div>
  )
}
