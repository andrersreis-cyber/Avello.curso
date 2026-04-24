'use client'

import { useState } from 'react'
import { OPERADORES_TOP, type OperadorRanking } from '@/lib/game/leaderboard'
import { SlotRanking } from './slot-ranking'
import { ModalProva } from './modal-prova'

export function Leaderboard() {
  const [aberto, setAberto] = useState<OperadorRanking | null>(null)

  const top3 = OPERADORES_TOP.slice(0, 3)
  const resto = OPERADORES_TOP.slice(3)

  return (
    <div>
      {/* Top 3 em destaque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-8 md:mb-10">
        {top3.map((op) => (
          <SlotRanking
            key={op.posicao}
            operador={op}
            destaque
            onClickProva={() => setAberto(op)}
          />
        ))}
      </div>

      {/* Posições 4-10 compactas */}
      <div className="space-y-2 mb-4">
        {resto.map((op) => (
          <SlotRanking
            key={op.posicao}
            operador={op}
            onClickProva={() => setAberto(op)}
          />
        ))}
      </div>

      <p className="mt-6 text-center font-hud text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        ranking atualizado semanalmente · últimos 90 dias
      </p>

      {aberto && <ModalProva operador={aberto} onClose={() => setAberto(null)} />}
    </div>
  )
}
