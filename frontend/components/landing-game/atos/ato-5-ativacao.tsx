'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Zap } from 'lucide-react'
import { CardOferta } from '../ativacao/card-oferta'
import { Countdown24h } from '../ativacao/countdown-24h'
import { FaqAccordion } from '../ativacao/faq-accordion'

interface Ato5AtivacaoProps {
  onEntrar?: () => void
  onAtivar: () => void | Promise<void>
}

export function Ato5Ativacao({ onEntrar, onAtivar }: Ato5AtivacaoProps) {
  const [carregando, setCarregando] = useState(false)
  const jaEntrouRef = useRef(false)

  useEffect(() => {
    if (jaEntrouRef.current) return
    jaEntrouRef.current = true
    onEntrar?.()
  }, [onEntrar])

  const handleClick = useCallback(async () => {
    if (carregando) return
    setCarregando(true)
    try {
      await onAtivar()
    } finally {
      setCarregando(false)
    }
  }, [carregando, onAtivar])

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] px-4 py-14 md:py-20">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(245,158,11,0.08),transparent_55%)]"
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-10 md:mb-12">
          <Countdown24h />
        </div>

        <header className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 font-hud text-[11px] uppercase tracking-[0.2em] text-amber-300 border border-amber-500/40 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            ato 5/5 · ativação
          </div>
          <h2
            id="ato-5-titulo"
            className="font-orbitron font-bold text-3xl md:text-4xl text-zinc-50 leading-tight"
          >
            hora de{' '}
            <span className="text-neon-cyan neon-text-cyan">ativar.</span>
          </h2>
          <p className="mt-4 text-zinc-400 font-exo2 text-base md:text-lg">
            o preço atual expira no cronômetro acima.{' '}
            <span className="text-zinc-200">depois volta pra R$ 199.</span>
          </p>
        </header>

        <div className="mb-14 md:mb-20">
          <CardOferta onAtivar={handleClick} carregando={carregando} />
        </div>

        <div className="mb-14 md:mb-20">
          <FaqAccordion />
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={handleClick}
            disabled={carregando}
            aria-label="ativar operador completo — ir pro pagamento"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 min-h-[64px] rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 disabled:cursor-wait text-zinc-950 font-orbitron font-bold uppercase tracking-wider text-base md:text-lg shadow-[0_0_40px_rgba(6,182,212,0.55)] hover:shadow-[0_0_60px_rgba(6,182,212,0.75)] active:scale-95 transition-all"
          >
            <Zap className="w-5 h-5" aria-hidden />
            {carregando ? 'abrindo checkout...' : 'ativar meu arsenal agora'}
          </button>
          <p className="text-center text-xs md:text-sm text-zinc-500 font-exo2">
            7 dias de garantia · cancela em 2 cliques ·{' '}
            <span className="text-zinc-300">risco = zero</span>
          </p>
        </div>
      </div>
    </div>
  )
}
