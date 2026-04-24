'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface TranscricaoProps {
  linhas: readonly string[]
  duracaoSegundos: number
}

/**
 * Revela as linhas do script conforme o áudio progride.
 *
 * Cada linha é digitada palavra-por-palavra (type-on effect). O tempo total
 * é dividido proporcionalmente pela quantidade de palavras da linha — linhas
 * mais longas digitam mais rápido e linhas curtas mais devagar, mas todas
 * terminam dentro da sua janela.
 *
 * Respeita `prefers-reduced-motion` (mostra tudo sem animar).
 */
export function Transcricao({ linhas, duracaoSegundos }: TranscricaoProps) {
  const [indiceLinha, setIndiceLinha] = useState(0)
  const [palavrasReveladas, setPalavrasReveladas] = useState(0)
  const reducedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  }, [])

  useEffect(() => {
    if (linhas.length === 0) return
    const timers: number[] = []
    const intervaloPorLinha = (duracaoSegundos * 1000) / linhas.length

    if (reducedRef.current) {
      // Sem animação: mostra tudo no início de cada janela
      for (let i = 0; i <= linhas.length; i += 1) {
        timers.push(
          window.setTimeout(() => {
            setIndiceLinha(i)
            setPalavrasReveladas(Infinity)
          }, intervaloPorLinha * i),
        )
      }
      return () => timers.forEach(window.clearTimeout)
    }

    for (let i = 0; i < linhas.length; i += 1) {
      const inicioLinha = intervaloPorLinha * i
      const palavras = linhas[i].split(/\s+/).filter(Boolean)
      const delayPorPalavra =
        palavras.length > 0 ? (intervaloPorLinha * 0.88) / palavras.length : 0

      timers.push(
        window.setTimeout(() => {
          setIndiceLinha(i)
          setPalavrasReveladas(0)
        }, inicioLinha),
      )

      palavras.forEach((_, p) => {
        timers.push(
          window.setTimeout(
            () => {
              setPalavrasReveladas((atual) => Math.max(atual, p + 1))
            },
            inicioLinha + delayPorPalavra * (p + 1),
          ),
        )
      })
    }

    // Após o fim da última linha, marca "todas reveladas"
    timers.push(
      window.setTimeout(() => {
        setIndiceLinha(linhas.length)
      }, duracaoSegundos * 1000),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [duracaoSegundos, linhas])

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="transcrição da ligação do agente 0"
      className="max-h-60 overflow-y-auto pr-1 space-y-2.5 text-left"
    >
      {linhas.map((linha, i) => {
        const reveladaCompleta = i < indiceLinha
        const digitando = i === indiceLinha
        const palavras = linha.split(/\s+/).filter(Boolean)

        return (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: reveladaCompleta ? 1 : digitando ? 1 : 0.2,
            }}
            transition={{ duration: 0.3 }}
            className={`text-sm md:text-base font-exo2 ${
              reveladaCompleta || digitando ? 'text-zinc-100' : 'text-zinc-600'
            }`}
          >
            {reveladaCompleta
              ? linha
              : digitando
                ? palavras.slice(0, palavrasReveladas).join(' ')
                : linha}
            {digitando && palavrasReveladas < palavras.length && (
              <span
                className="inline-block w-1.5 h-4 bg-neon-cyan align-middle ml-1 animate-pulse"
                aria-hidden
              />
            )}
          </motion.p>
        )
      })}
    </div>
  )
}
