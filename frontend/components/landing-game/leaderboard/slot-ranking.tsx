'use client'

import { motion } from 'framer-motion'
import { Eye, TrendingUp } from 'lucide-react'
import { formatarXp, type OperadorRanking } from '@/lib/game/leaderboard'
import { Medalha } from './medalha'
import { AvatarOperador } from './avatar-operador'

interface SlotRankingProps {
  operador: OperadorRanking
  destaque?: boolean
  onClickProva: () => void
}

export function SlotRanking({ operador, destaque = false, onClickProva }: SlotRankingProps) {
  const temProva = operador.provaTipo !== 'nenhuma'

  if (destaque) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-5 md:p-6 shadow-[0_0_50px_rgba(6,182,212,0.08)] overflow-hidden"
        aria-labelledby={`rank-${operador.posicao}-nome`}
      >
        {operador.medalha !== 'sem' && (
          <div
            aria-hidden
            className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-20 blur-3xl"
            style={{
              background:
                operador.medalha === 'ouro'
                  ? '#fbbf24'
                  : operador.medalha === 'prata'
                  ? '#e4e4e7'
                  : '#d97706',
            }}
          />
        )}

        <div className="flex items-start justify-between gap-3 mb-4">
          <Medalha tier={operador.medalha} posicao={operador.posicao} />
          <span className="font-hud text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            ativo há {operador.diasAtivo}d
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <AvatarOperador nome={operador.nome} nivel={operador.nivel} size={56} />
          <div className="min-w-0">
            <h3
              id={`rank-${operador.posicao}-nome`}
              className="font-orbitron font-bold text-lg text-zinc-50 truncate"
            >
              {operador.nome}
            </h3>
            <p className="font-hud text-[11px] uppercase tracking-[0.15em] text-neon-cyan">
              nv {operador.nivel} · {operador.classe.toLowerCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 font-hud text-xs uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-green-400" aria-hidden />
          <span className="text-green-300 tabular-nums">{formatarXp(operador.xp)} xp</span>
        </div>

        <p className="text-sm text-zinc-300 font-exo2 leading-snug mb-5 min-h-[2.5rem]">
          {operador.conquista}
        </p>

        {temProva ? (
          <button
            type="button"
            onClick={onClickProva}
            className="inline-flex items-center gap-2 text-xs font-hud uppercase tracking-[0.18em] text-neon-cyan hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg px-3 py-2 transition-colors cursor-pointer w-full justify-center"
            aria-label={`ver prova de ${operador.nome}`}
          >
            <Eye className="w-3.5 h-3.5" aria-hidden />
            ver prova
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 text-xs font-hud uppercase tracking-[0.18em] text-zinc-600 border border-zinc-800 rounded-lg px-3 py-2 w-full justify-center">
            sem prova pública
          </span>
        )}
      </motion.article>
    )
  }

  // Versão compacta (4º-10º)
  return (
    <motion.article
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-3 md:gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-cyan-500/30 hover:bg-zinc-900/60 transition-colors px-3 md:px-4 py-3"
      aria-labelledby={`rank-${operador.posicao}-nome-compact`}
    >
      <Medalha tier={operador.medalha} posicao={operador.posicao} />
      <AvatarOperador nome={operador.nome} nivel={operador.nivel} size={40} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3
            id={`rank-${operador.posicao}-nome-compact`}
            className="font-orbitron font-semibold text-sm md:text-base text-zinc-100 truncate"
          >
            {operador.nome}
          </h3>
          <span className="font-hud text-[10px] uppercase tracking-[0.15em] text-zinc-500">
            nv {operador.nivel}
          </span>
        </div>
        <p className="text-xs md:text-sm text-zinc-400 font-exo2 truncate">
          {operador.conquista}
        </p>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
        <span className="font-hud text-[10px] uppercase tracking-wider text-green-400 tabular-nums">
          {formatarXp(operador.xp)} xp
        </span>
        <span className="font-hud text-[9px] uppercase tracking-[0.15em] text-zinc-600">
          {operador.diasAtivo}d ativo
        </span>
      </div>

      {temProva && (
        <button
          type="button"
          onClick={onClickProva}
          className="shrink-0 flex items-center justify-center w-11 h-11 -mr-2 rounded-lg text-zinc-500 hover:text-neon-cyan hover:bg-cyan-500/10 transition-colors cursor-pointer"
          aria-label={`ver prova de ${operador.nome}`}
        >
          <Eye className="w-4 h-4" aria-hidden />
        </button>
      )}
    </motion.article>
  )
}
