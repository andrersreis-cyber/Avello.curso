'use client'

/**
 * Landing express — versão direta, alta-conversão pra cold traffic de Meta Ads.
 *
 * NÃO é a versão gameficada (que ficou em /jornada). Esta é uma página de
 * oferta clássica: hero → benefícios → grupo → preço/timer → FAQ → CTA.
 *
 * Pixel: ViewContent dispara na chegada, InitiateCheckout dispara no clique
 * de qualquer CTA. Purchase dispara em /loja/sucesso (ou /obrigado para
 * source='landing') após retorno do Stripe.
 */

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  trackInitiateCheckout,
  trackViewContent,
} from '@/lib/game/pixel'
import {
  PRECO_OFERTA_REAIS,
  ITENS_OFERTA,
  FAQ,
} from '@/lib/game/oferta'

const PRECO_ORIGINAL = 297 // ancoragem do anúncio (não da oferta diária)
const COUNTDOWN_HORAS = 72
const COUNTDOWN_STORAGE_KEY = 'avello_landing_express_countdown_v1'

// ────────────────────────────────────────────────────────────
// helpers
// ────────────────────────────────────────────────────────────

function formatarPreco(reais: number): string {
  return reais.toFixed(2).replace('.', ',')
}

function calcularSegundosRestantes(): number {
  if (typeof window === 'undefined') return COUNTDOWN_HORAS * 3600
  const inicio = window.localStorage.getItem(COUNTDOWN_STORAGE_KEY)
  const agora = Date.now()
  if (!inicio) {
    window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, String(agora))
    return COUNTDOWN_HORAS * 3600
  }
  const decorrido = Math.floor((agora - Number(inicio)) / 1000)
  const restante = COUNTDOWN_HORAS * 3600 - decorrido
  return Math.max(0, restante)
}

function fmtCountdown(s: number): { h: string; m: string; s: string } {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return {
    h: String(h).padStart(2, '0'),
    m: String(m).padStart(2, '0'),
    s: String(sec).padStart(2, '0'),
  }
}

// ────────────────────────────────────────────────────────────
// componente principal
// ────────────────────────────────────────────────────────────

export default function LandingExpressPage() {
  // Lazy init pra ler localStorage no client e fallback seguro pro SSR.
  // calcularSegundosRestantes já trata typeof window === 'undefined'.
  const [countdown, setCountdown] = useState(() => calcularSegundosRestantes())
  const [carregandoCheckout, setCarregandoCheckout] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Pixel: ViewContent na chegada
  useEffect(() => {
    trackViewContent('landing-express')
  }, [])

  // Countdown de 72h — só re-tick a cada segundo, valor inicial já vem do useState
  useEffect(() => {
    const intervalo = setInterval(() => {
      setCountdown(calcularSegundosRestantes())
    }, 1000)
    return () => clearInterval(intervalo)
  }, [])

  const irParaCheckout = useCallback(async () => {
    setErro(null)
    setCarregandoCheckout(true)
    trackInitiateCheckout(PRECO_OFERTA_REAIS)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'operador_anual', source: 'landing' }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setErro('Erro ao abrir checkout. Tenta de novo em 1 minuto.')
        setCarregandoCheckout(false)
      }
    } catch {
      setErro('Erro ao abrir checkout. Tenta de novo em 1 minuto.')
      setCarregandoCheckout(false)
    }
  }, [])

  const cd = fmtCountdown(countdown)

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-50 font-exo2 overflow-x-hidden">
      {/* ──────────── Top banner ──────────── */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 text-white text-center py-2 text-xs sm:text-sm font-semibold tracking-wide font-share-tech-mono">
        🔓 ARSENAL LIBERADO · OFERTA TERMINA EM {cd.h}:{cd.m}:{cd.s}
      </div>

      {/* ──────────── Header ──────────── */}
      <header className="px-6 py-5 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm font-orbitron">A</span>
          </div>
          <span className="font-orbitron font-semibold tracking-wider text-lg">avello</span>
        </div>
        <Link
          href="/login"
          className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
        >
          já é membro? entrar
        </Link>
      </header>

      {/* ──────────── HERO ──────────── */}
      <section className="px-6 pt-8 sm:pt-16 pb-12 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs font-share-tech-mono tracking-widest mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          SINAL INTERCEPTADO · 72H
        </div>

        <h1 className="font-orbitron font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-6">
          Arsenal completo de IA por{' '}
          <span className="text-cyan-400">R$ {formatarPreco(PRECO_OFERTA_REAIS)}</span> o ano.
        </h1>

        <p className="text-lg sm:text-xl text-zinc-300 mb-3 max-w-2xl mx-auto">
          Era R$ {PRECO_ORIGINAL}. <span className="text-cyan-400 font-semibold">80% off</span>. Acaba em 72h. Depois volta pro preço cheio.
        </p>

        <p className="text-base text-zinc-400 mb-10 max-w-2xl mx-auto">
          Você não compra só uma plataforma — entra num canal aberto que recebe, toda semana,
          as <span className="text-zinc-200">skills do Claude Code mais usadas</span>,{' '}
          <span className="text-zinc-200">cases reais de projetos</span> e{' '}
          <span className="text-zinc-200">ideias prontas pra implementar</span>.
        </p>

        <button
          type="button"
          onClick={irParaCheckout}
          disabled={carregandoCheckout}
          className="inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg shadow-[0_8px_32px_rgba(6,182,212,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed font-orbitron tracking-wide w-full sm:w-auto"
        >
          {carregandoCheckout ? 'abrindo checkout...' : `Ativar arsenal — R$ ${formatarPreco(PRECO_OFERTA_REAIS)}/ano`}
        </button>

        <p className="text-xs text-zinc-500 mt-4 font-share-tech-mono tracking-wider uppercase">
          acesso imediato · garantia 7 dias · cartão à vista ou parcelado
        </p>

        {erro && (
          <div className="mt-6 mx-auto max-w-md px-4 py-3 rounded-xl border border-orange-500/50 bg-orange-500/10 text-orange-200 text-sm">
            {erro}
          </div>
        )}
      </section>

      {/* ──────────── O grupo (DIFERENCIAL DO ANÚNCIO) ──────────── */}
      <section className="px-6 py-16 bg-gradient-to-b from-zinc-950 via-cyan-950/10 to-zinc-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-xs font-share-tech-mono tracking-widest uppercase mb-3">
              o diferencial
            </p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-4">
              O grupo é o arsenal real.
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Enquanto a galera tá descobrindo IA no YouTube,
              você tá vendo o que tá pegando AGORA — direto do grupo, toda semana.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                titulo: 'Skills do Claude Code',
                desc: 'As mais usadas, organizadas. Sem garimpo em newsletter.',
              },
              {
                titulo: 'Cases reais',
                desc: 'Projetos rodando agora. Quanto custou, quanto rendeu, como foi feito.',
              },
              {
                titulo: 'Ideias prontas',
                desc: 'Pra você implementar e cobrar. Com prompt e fluxo já mapeado.',
              },
            ].map((item) => (
              <div
                key={item.titulo}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <span className="text-cyan-400 font-bold font-orbitron">▸</span>
                </div>
                <h3 className="font-orbitron font-semibold text-lg mb-2">{item.titulo}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── O que tá dentro ──────────── */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-xs font-share-tech-mono tracking-widest uppercase mb-3">
              tudo desbloqueado
            </p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-4">
              O que entra no arsenal
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {ITENS_OFERTA.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl ${
                  item.destaque
                    ? 'bg-cyan-500/10 border border-cyan-500/30'
                    : 'bg-zinc-900/50 border border-zinc-800'
                }`}
              >
                <span
                  className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                    item.destaque ? 'bg-cyan-500' : 'bg-zinc-700'
                  }`}
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span
                  className={`text-sm ${
                    item.destaque ? 'text-cyan-100 font-medium' : 'text-zinc-300'
                  }`}
                >
                  {item.texto}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── Comparação de preço + timer ──────────── */}
      <section className="px-6 py-16 bg-gradient-to-b from-zinc-950 to-zinc-900/40">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl border-2 border-cyan-500/40 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 sm:p-10 shadow-[0_8px_64px_rgba(6,182,212,0.2)]">
            <p className="text-center text-xs font-share-tech-mono tracking-widest uppercase text-cyan-400 mb-6">
              oferta de lançamento
            </p>

            <div className="text-center mb-8">
              <p className="text-zinc-500 text-sm mb-2">era</p>
              <p className="text-3xl text-zinc-500 line-through font-orbitron mb-1">
                R$ {PRECO_ORIGINAL}
              </p>
              <p className="text-zinc-400 text-sm mb-4">agora</p>
              <p className="font-orbitron font-bold text-6xl sm:text-7xl text-cyan-400 mb-2">
                R$ {formatarPreco(PRECO_OFERTA_REAIS)}
              </p>
              <p className="text-zinc-400 text-sm">12 meses · pagamento único</p>
            </div>

            {/* Timer */}
            <div className="mb-8 rounded-2xl bg-zinc-950/60 border border-zinc-800 p-5">
              <p className="text-center text-xs font-share-tech-mono tracking-widest uppercase text-zinc-400 mb-3">
                a oferta acaba em
              </p>
              <div className="flex justify-center gap-3 sm:gap-6">
                {[
                  { v: cd.h, l: 'horas' },
                  { v: cd.m, l: 'min' },
                  { v: cd.s, l: 'seg' },
                ].map((b) => (
                  <div key={b.l} className="text-center">
                    <div className="font-orbitron font-bold text-3xl sm:text-4xl text-cyan-400 tabular-nums">
                      {b.v}
                    </div>
                    <div className="text-[10px] text-zinc-500 font-share-tech-mono tracking-widest uppercase mt-1">
                      {b.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={irParaCheckout}
              disabled={carregandoCheckout}
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg shadow-[0_8px_32px_rgba(6,182,212,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed font-orbitron tracking-wide"
            >
              {carregandoCheckout ? 'abrindo checkout...' : `Quero o arsenal — R$ ${formatarPreco(PRECO_OFERTA_REAIS)}`}
            </button>

            <p className="text-center text-xs text-zinc-500 mt-4 font-share-tech-mono tracking-wider uppercase">
              acesso imediato · garantia 7 dias · stripe
            </p>
          </div>
        </div>
      </section>

      {/* ──────────── FAQ ──────────── */}
      <section className="px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-xs font-share-tech-mono tracking-widest uppercase mb-3">
              perguntas que todo mundo faz
            </p>
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-4">
              FAQ
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((q) => (
              <details
                key={q.pergunta}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-cyan-500/40 transition-colors overflow-hidden"
              >
                <summary className="cursor-pointer px-5 py-4 flex items-center justify-between gap-4 list-none">
                  <span className="font-medium text-zinc-200">{q.pergunta}</span>
                  <span className="shrink-0 text-cyan-400 group-open:rotate-45 transition-transform font-orbitron text-xl">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-zinc-400 leading-relaxed">
                  {q.resposta}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── CTA final ──────────── */}
      <section className="px-6 py-20 bg-gradient-to-b from-zinc-950 via-cyan-950/20 to-zinc-950">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-4">
            Câmbio. 🔓
          </h2>
          <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
            12 meses de arsenal por R$ {formatarPreco(PRECO_OFERTA_REAIS)}. Quando o timer zera, volta pra R$ {PRECO_ORIGINAL}. Decisão é tua.
          </p>

          <button
            type="button"
            onClick={irParaCheckout}
            disabled={carregandoCheckout}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-lg shadow-[0_8px_32px_rgba(6,182,212,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed font-orbitron tracking-wide w-full sm:w-auto"
          >
            {carregandoCheckout ? 'abrindo checkout...' : `Ativar agora — R$ ${formatarPreco(PRECO_OFERTA_REAIS)}`}
          </button>

          <p className="text-xs text-zinc-500 mt-4 font-share-tech-mono tracking-wider uppercase">
            72 horas · 80% off · acesso imediato
          </p>
        </div>
      </section>

      {/* ──────────── Footer ──────────── */}
      <footer className="px-6 py-10 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© Avello · arsenal de IA</p>
          <div className="flex items-center gap-5">
            <Link href="/termos" className="hover:text-cyan-400 transition-colors">
              termos
            </Link>
            <Link href="/privacidade" className="hover:text-cyan-400 transition-colors">
              privacidade
            </Link>
            <Link href="/jornada" className="hover:text-cyan-400 transition-colors">
              jornada interativa
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
