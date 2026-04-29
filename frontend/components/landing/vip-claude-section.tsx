'use client'

import { useState } from 'react'
import { Zap, Sparkles, FlaskConical, ArrowRight } from 'lucide-react'

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

const cards = [
  {
    icon: Zap,
    badge: 'Toda semana',
    title: 'Skills do Claude Code',
    description:
      'Skill nova caiu no grupo. Agente que escreve copy com voz da marca em 1 prompt. Automação que posta no Instagram sozinha. Fluxo de pesquisa de mercado em 1 comando.',
    footer: 'Você usa antes do Twitter ficar sabendo.',
    color: 'from-cyan-500 to-blue-500',
    bgGlow: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Sparkles,
    badge: 'Print do PIX no grupo',
    title: 'Casos reais que funcionaram',
    description:
      'Operador postou ontem: cobrou R$ 4.700 por agente de WhatsApp que atende 200 clientes/dia. Implementou em 3 horas usando templates do arsenal. O print do recebimento tá lá.',
    footer: 'Você vê o caminho que funcionou — sem chutar.',
    color: 'from-green-500 to-emerald-500',
    bgGlow: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
  },
  {
    icon: FlaskConical,
    badge: 'Direto da fonte',
    title: 'O que tá saindo do forno',
    description:
      'Anthropic lançou prompt caching ontem. Hoje o template adaptado pro seu nicho já tá no grupo, com explicação de quando usar e quanto economiza em API. Antes da concorrência saber.',
    footer: 'Surfa a onda na crista, não na espuma.',
    color: 'from-purple-500 to-pink-500',
    bgGlow: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
  },
]

export function VipClaudeSection() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    await irParaCheckout()
    setLoading(false)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background — efeito de "atmosfera de hub secreto" */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-400 font-semibold uppercase tracking-wider">
              Grupo VIP · Atualizado toda semana
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            O que entra toda semana no
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              grupo de operadores
            </span>
          </h2>

          <p className="text-lg md:text-xl text-zinc-400 leading-relaxed">
            Enquanto você dorme, alguém posta a skill nova do Claude Code, o print do PIX de R$ 4.700, o template adaptado pra atualização que a Anthropic lançou ontem.{' '}
            <span className="text-white font-semibold">
              O grupo é onde acontece — antes de virar tendência no Twitter.
            </span>
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-sm border ${card.borderColor} hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
              >
                {/* Glow no hover */}
                <div
                  className={`absolute inset-0 ${card.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl`}
                />

                {/* Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${card.color} bg-opacity-10 mb-5`}>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {card.badge}
                  </span>
                </div>

                {/* Ícone */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} mb-5 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {card.title}
                </h3>

                {/* Descrição */}
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {card.description}
                </p>

                {/* Footer line */}
                <div className="pt-4 border-t border-zinc-800">
                  <p className={`text-sm font-semibold ${card.iconColor}`}>
                    → {card.footer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA da seção */}
        <div className="text-center mt-14">
          <p className="text-zinc-300 text-lg mb-2">
            O grupo é onde acontece. <span className="text-cyan-400 font-semibold">R$ 59,99 é o ingresso.</span>
          </p>
          <p className="text-sm text-orange-400 font-medium mb-6">
            Era R$ 39 pra fundadores. Vai virar R$ 99 quando bater 1.000 membros.
          </p>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="group inline-flex items-center justify-center gap-3 h-[68px] px-10 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white rounded-xl font-bold text-xl transition-all shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105"
          >
            <Zap className="w-6 h-6" />
            <span className="font-orbitron tracking-wide">
              {loading ? 'Abrindo checkout...' : 'Entrar no grupo — R$ 59,99'}
            </span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-xs text-zinc-500 mt-4">
            Garantia 7 dias · Acesso imediato ao grupo · Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  )
}
