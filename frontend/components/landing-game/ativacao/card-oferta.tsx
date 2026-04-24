'use client'

import { CheckCircle2, Lock, ShieldCheck, Zap } from 'lucide-react'
import {
  DESCONTO_PERCENT,
  ITENS_OFERTA,
  PRECO_ANCORA_REAIS,
  PRECO_OFERTA_REAIS,
} from '@/lib/game/oferta'

interface CardOfertaProps {
  onAtivar: () => void | Promise<void>
  carregando?: boolean
}

function formatarReal(valor: number): string {
  const [inteiro, decimal] = valor.toFixed(2).split('.')
  return decimal === '00' ? inteiro : `${inteiro},${decimal}`
}

export function CardOferta({ onAtivar, carregando = false }: CardOfertaProps) {
  return (
    <div className="relative rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-zinc-900 via-zinc-900 to-cyan-950/30 shadow-[0_0_48px_rgba(245,158,11,0.25)] p-6 md:p-8 max-w-xl mx-auto">
      <div className="flex justify-center mb-6">
        <span className="inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-amber-500/50 bg-gradient-to-r from-amber-500/20 to-amber-400/20 text-amber-300">
          <Zap className="w-3.5 h-3.5" aria-hidden />
          item lendário · -{DESCONTO_PERCENT}% off
        </span>
      </div>

      <div className="text-center mb-6">
        <h3 className="font-orbitron font-bold text-xl md:text-2xl text-zinc-50 mb-4 uppercase tracking-wide">
          operador completo
        </h3>
        <div className="flex items-baseline justify-center gap-3 flex-wrap">
          <span className="line-through text-zinc-500 text-lg font-exo2">
            R$ {formatarReal(PRECO_ANCORA_REAIS)}
          </span>
          <div className="flex items-baseline">
            <span className="font-orbitron font-bold text-5xl md:text-6xl text-zinc-50 tabular-nums">
              R$ {formatarReal(PRECO_OFERTA_REAIS)}
            </span>
            <span className="ml-2 font-exo2 text-zinc-400 text-base md:text-lg">/ano</span>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5 mb-7">
        {ITENS_OFERTA.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2
              className="w-5 h-5 text-neon-green shrink-0 mt-0.5"
              aria-hidden
            />
            <span
              className={`text-sm md:text-base font-exo2 ${
                item.destaque ? 'font-semibold text-zinc-50' : 'text-zinc-300'
              }`}
            >
              {item.texto}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onAtivar}
        disabled={carregando}
        aria-label="ativar operador completo — ir pro pagamento"
        className="w-full min-h-[64px] inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 disabled:cursor-wait text-zinc-950 font-orbitron font-bold uppercase tracking-wider text-base md:text-lg shadow-[0_0_40px_rgba(6,182,212,0.55)] hover:shadow-[0_0_60px_rgba(6,182,212,0.75)] active:scale-95 transition-all"
      >
        <Zap className="w-5 h-5" aria-hidden />
        {carregando ? 'abrindo checkout...' : 'ativar meu arsenal agora'}
      </button>

      <div className="mt-5 flex flex-col gap-2 text-center text-xs md:text-sm text-zinc-400 font-exo2">
        <div className="inline-flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-neon-green" aria-hidden />
          pagamento seguro · Stripe
        </div>
        <div className="inline-flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-neon-green" aria-hidden />
          garantia 7 dias · reembolso total
        </div>
      </div>
    </div>
  )
}
