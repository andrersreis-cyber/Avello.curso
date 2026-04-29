'use client'

import { useState } from 'react'
import { Zap, ArrowRight } from 'lucide-react'

async function irParaCheckout() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: 59.99, currency: 'BRL', content_name: 'Operador Anual',
    })
  }
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'operador_anual', source: 'landing' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  } catch {
    window.location.href = '/loja'
  }
}

export function HeroSection() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    await irParaCheckout()
    setLoading(false)
  }

  return (
    <section className="pt-32 pb-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Badge de urgência */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/15 to-red-500/10 rounded-full border border-orange-500/40 mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-sm text-orange-400 font-semibold">
            Era R$39 (fundadores) → R$59,99 agora → R$99 após 1.000 membros
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Outros vendem curso.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            A gente entrega o arsenal.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
          Skills do Claude Code, templates n8n e SaaS prontos. O arsenal que devs sêniores cobram R$ 250/h pra montar — <span className="text-white font-semibold">você adapta em 12 minutos</span>. Atualizado toda semana, direto da fonte.
        </p>

        {/* CTA Principal — padronizado h=68 / 20px / 700 */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="group relative inline-flex items-center justify-center gap-3 h-[68px] px-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white rounded-xl font-bold text-xl transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
          >
            <span className="absolute -top-3 -right-3 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              -40% OFF
            </span>
            <Zap className="w-6 h-6" />
            <span className="font-orbitron tracking-wide">
              {loading ? 'Abrindo checkout...' : 'Quero o arsenal — R$ 59,99'}
            </span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-zinc-500">
            Garantia 7 dias · Acesso imediato · Cancele quando quiser
          </p>
        </div>

        {/* Microcopy + Tech stack - em destaque */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-4 mb-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-sm font-medium text-green-400">
              ✓ Garantia 7 dias
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-sm font-medium text-cyan-400">
              ✓ Acesso imediato
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-sm font-medium text-purple-400">
              ✓ Atualizado toda semana
            </span>
          </div>
          <span className="hidden sm:inline w-px h-6 bg-zinc-600" />
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Integra com</span>
            <span className="text-sm font-semibold text-white">n8n</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">ChatGPT</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">Midjourney</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">Typebot</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">WhatsApp</span>
          </div>
        </div>

      </div>
    </section>
  )
}
