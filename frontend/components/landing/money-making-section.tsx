'use client'

import { useState } from 'react'
import { DollarSign, Rocket, Target, TrendingUp, Zap } from 'lucide-react'

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

const opportunities = [
  {
    icon: DollarSign,
    title: 'Vender Automações',
    description: 'Implemente fluxos de WhatsApp, atendimento, captação e integração para pequenos negócios. Cobre pela implementação e suporte.',
    earnings: 'R$ 250 - 500',
    period: 'por projeto',
    color: 'from-green-500 to-emerald-500',
    examples: [
      'Automação de WhatsApp',
      'Integração de sistemas',
      'Fluxos de vendas'
    ]
  },
  {
    icon: Rocket,
    title: 'Criar Micro SaaS',
    description: 'Pegue um app white-label, personalize com sua marca e cobre mensalidade recorrente (R$ 97/mês por cliente).',
    earnings: 'R$ 300+',
    period: 'por cliente/mês',
    color: 'from-blue-500 to-cyan-500',
    examples: [
      'Plataforma de agendamento',
      'Sistema de CRM',
      'Automação de marketing'
    ]
  },
  {
    icon: Target,
    title: 'Prestar Serviços IA',
    description: 'Ofereça criação de conteúdo, otimização de processos, consultoria e automação comercial com IA.',
    earnings: 'R$ 500+',
    period: 'por projeto',
    color: 'from-purple-500 to-pink-500',
    examples: [
      'Criação de conteúdo',
      'Consultoria IA',
      'Otimização de processos'
    ]
  },
]

export function MoneyMakingSection() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    await irParaCheckout()
    setLoading(false)
  }

  return (
    <section className="py-20 bg-zinc-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30 mb-4">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Oportunidades de Renda</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Use a Avello para economizar
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              e gerar renda
            </span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Veja como nossos membros estão usando a plataforma para criar novas fontes de renda
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {opportunities.map((opportunity, index) => {
            const Icon = opportunity.icon
            return (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${opportunity.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {opportunity.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
                  {opportunity.description}
                </p>

                {/* Examples */}
                <div className="space-y-1.5 mb-4">
                  {opportunity.examples.map((example, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                      <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${opportunity.color}`} />
                      <span>{example}</span>
                    </div>
                  ))}
                </div>

                {/* Earnings */}
                <div className={`inline-flex flex-col gap-1 px-4 py-3 rounded-xl bg-gradient-to-r ${opportunity.color} shadow-lg`}>
                  <span className="text-2xl font-bold text-white">
                    {opportunity.earnings}
                  </span>
                  <span className="text-xs text-white/90 font-medium">{opportunity.period}</span>
                </div>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-2xl bg-gradient-to-br ${opportunity.color}`} 
                  style={{ transform: 'scale(0.9)' }} 
                />
              </div>
            )
          })}
        </div>

        <p className="text-center text-zinc-400 max-w-2xl mx-auto mb-12">
          Você não precisa usar tudo. Só precisa de um modelo, um nicho e uma oferta para recuperar o investimento.
        </p>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            {loading ? 'Abrindo checkout...' : 'Desbloquear tudo — R$ 59,99/ano'}
          </button>
          <p className="text-sm text-zinc-500 mt-4">
            R$ 59,99 = menos que 1 projeto. O resto é lucro puro.
          </p>
        </div>
      </div>
    </section>
  )
}
