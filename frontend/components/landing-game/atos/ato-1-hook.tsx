'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Clock, Radio, Users } from 'lucide-react'
import { GlitchText } from '../shared/glitch-text'
import { BadgeIntelAtivo } from '../central-intel/badge-intel-ativo'

interface Ato1HookProps {
  onAvancar: (nome: string | null) => void
}

const FADE_UP = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
}

export function Ato1Hook({ onAvancar }: Ato1HookProps) {
  const [nome, setNome] = useState('')
  const [foco, setFoco] = useState(false)

  const handleEntrar = useCallback(() => {
    const nomeTratado = nome.trim()
    onAvancar(nomeTratado.length > 0 ? nomeTratado : null)
  }, [nome, onAvancar])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      handleEntrar()
    },
    [handleEntrar],
  )

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] flex items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_55%),radial-gradient(circle_at_80%_100%,rgba(217,70,239,0.12),transparent_55%)]"
      />

      <div className="max-w-3xl w-full text-center">
        <motion.div
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] text-neon-cyan border border-cyan-500/30 rounded-full px-3 py-1 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          jornada interativa · ato 1/5
        </motion.div>

        <GlitchText
          as="h1"
          className="font-orbitron font-bold tracking-tight leading-[1.05] text-zinc-50 neon-text-cyan"
        >
          <span className="block" style={{ fontSize: 'clamp(1.75rem, 6vw, 3.75rem)' }}>
            800 operadores ativaram o arsenal nas
          </span>
          <span
            className="block mt-2 bg-gradient-to-r from-cyan-400 via-cyan-300 to-fuchsia-400 bg-clip-text text-transparent"
            style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)' }}
          >
            últimas 72 horas.
          </span>
          <span className="block mt-2" style={{ fontSize: 'clamp(1.5rem, 5.5vw, 3.25rem)' }}>
            <em className="not-italic text-neon-green">3 minutos</em> separam você deles.
          </span>
        </GlitchText>

        <motion.p
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-base md:text-lg text-zinc-400 leading-relaxed font-exo2"
        >
          5 atos. 3 minutos.{' '}
          <span className="text-zinc-200">zero cadastro.</span>
        </motion.p>

        <motion.form
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.32 }}
          onSubmit={handleSubmit}
          className="mt-8 mx-auto max-w-md"
          aria-label="identificação do operador"
        >
          <label
            htmlFor="nome-operador"
            className="block font-hud text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2"
          >
            qual seu primeiro nome, operador?
          </label>
          <div className="relative">
            <input
              id="nome-operador"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onFocus={() => setFoco(true)}
              onBlur={() => setFoco(false)}
              maxLength={24}
              autoComplete="given-name"
              placeholder="ex: andré"
              className="w-full px-4 py-3 pr-16 rounded-lg bg-zinc-900/70 border border-zinc-700 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-zinc-50 font-exo2 placeholder:text-zinc-600 transition-colors"
              aria-describedby="nome-operador-hint"
            />
            {foco && (
              <span
                aria-hidden
                className="absolute right-3 top-1/2 -translate-y-1/2 font-hud text-[10px] uppercase tracking-wider text-zinc-500"
              >
                {nome.length}/24
              </span>
            )}
          </div>
          <p
            id="nome-operador-hint"
            className="mt-2 text-[11px] font-hud uppercase tracking-wider text-zinc-600"
          >
            opcional · aparece na sua missão personalizada
          </p>
        </motion.form>

        <motion.div
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.42 }}
          className="mt-8 flex flex-col items-center gap-3"
        >
          <button
            type="button"
            onClick={handleEntrar}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-orbitron font-bold uppercase tracking-wider text-base md:text-lg shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:shadow-[0_0_60px_rgba(6,182,212,0.65)] transition-shadow min-h-[56px] cursor-pointer"
            aria-label="entrar no sistema — ato 1 de 5"
          >
            <span aria-hidden>▶</span>
            entrar no sistema
            <ChevronRight
              className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
              aria-hidden
            />
          </button>

          {nome.trim().length === 0 && (
            <button
              type="button"
              onClick={handleEntrar}
              className="font-hud text-[11px] uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              aria-label="pular identificação e entrar anônimo"
            >
              pular —&gt; entrar anônimo
            </button>
          )}

          <p className="font-hud text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            som ativado ao iniciar · pode mutar no topo
          </p>
        </motion.div>

        <motion.ul
          {...FADE_UP}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs md:text-sm font-hud text-zinc-500 uppercase tracking-wider"
        >
          <li className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neon-cyan" aria-hidden />
            800+ online
          </li>
          <li>
            <BadgeIntelAtivo compact />
          </li>
          <li className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" aria-hidden />
            updates toda semana
          </li>
          <li className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-green" aria-hidden />
            3 min
          </li>
        </motion.ul>
      </div>
    </div>
  )
}
