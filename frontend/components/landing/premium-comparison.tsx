'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, Zap, Crown, Shield, ShoppingCart } from 'lucide-react'

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

const NOMES = [
  'Lucas', 'Pedro', 'Gabriel', 'Mateus', 'Rafael', 'Thiago', 'Bruno', 'Diego',
  'Felipe', 'Guilherme', 'João', 'Carlos', 'André', 'Rodrigo', 'Marcelo',
  'Ana', 'Maria', 'Juliana', 'Fernanda', 'Patricia', 'Amanda', 'Camila',
  'Beatriz', 'Larissa', 'Vanessa', 'Mariana', 'Leticia', 'Renata'
]

const CIDADES = [
  'SP', 'RJ', 'BH', 'Curitiba', 'Porto Alegre', 'Fortaleza', 'Salvador',
  'Recife', 'Goiânia', 'Florianópolis', 'Campinas', 'Natal', 'Belém'
]

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function usePurchaseSimulator(initial = 940) {
  const [vagas, setVagas] = useState(initial)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const [toastId, setToastId] = useState(0)

  const fire = useCallback(() => {
    const id = toastId + 1
    setToastId(id)
    setToast({ id, text: `${getRandom(NOMES)} de ${getRandom(CIDADES)} acabou de entrar` })
    setVagas(prev => Math.max(prev - 1, 800))
    setTimeout(() => setToast(null), 4000)
  }, [toastId])

  useEffect(() => {
    const t = setTimeout(fire, 10000)
    const interval = setInterval(fire, Math.random() * 35000 + 25000)
    return () => { clearTimeout(t); clearInterval(interval) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { vagas, toast }
}

const premiumFeatures = [
  '+2500 Templates n8n completos',
  '+500 Chatbots prontos',
  '+2400 Prompts ChatGPT',
  '+3500 Prompts Midjourney',
  '+3000 Templates Typebot',
  '+14 mil Ferramentas IA',
  '+350 Self-Hosted Apps',
  '+30 SaaS White Label',
  '+8 Bônus Exclusivos',
  'Skills do Claude Code (atualizadas toda semana)',
  'Grupo VIP com casos reais e prints',
]

export function PremiumComparison() {
  const { vagas, toast } = usePurchaseSimulator()
  const preenchidas = 1000 - vagas
  const percentual = (preenchidas / 1000) * 100
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    await irParaCheckout()
    setLoading(false)
  }

  return (
    <section id="precos" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Urgency Banner + barra de progresso com simulador */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-3 px-6 py-4 bg-orange-500/10 rounded-xl border border-orange-500/30 min-w-[320px]">
            <span className="text-sm text-orange-400 font-semibold">
              Era R$39 (fundadores) → R$59,99 agora → R$99 após 1.000 membros
            </span>
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                <span className="font-medium text-orange-400">{preenchidas} membros</span>
                <span>meta: 1.000</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${percentual}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-zinc-500">
                  <span className="text-orange-400 font-bold">{vagas}</span> vagas restantes
                </p>
                {toast && (
                  <div key={toast.id} className="flex items-center gap-1 text-xs text-green-400 animate-pulse">
                    <ShoppingCart className="w-3 h-3" />
                    <span>{toast.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Um plano. Tudo dentro. Sem pegadinha.
          </h2>
          <p className="text-zinc-400 text-lg">
            <span className="text-white font-semibold">Garantia de 7 dias</span>. Não gostou? Devolvemos 100%.
          </p>
        </div>

        {/* Plano único — Operador Anual (foco total em conversão) */}
        <div className="max-w-xl mx-auto">
          <div className="relative bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 md:p-10 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
              OPERADOR ANUAL
            </div>

            <div className="mb-6 mt-2 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Crown className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Acesso Completo</h3>
              </div>
              <p className="text-zinc-400 text-sm">
                O arsenal inteiro + grupo VIP + Skills do Claude Code toda semana
              </p>
            </div>

            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded border border-orange-500/30">
                  ⚡ Era R$39
                </span>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30">
                  −40% OFF
                </span>
              </div>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-2xl text-zinc-500 line-through font-medium font-orbitron">R$ 99</span>
                <span className="text-6xl font-bold text-white font-orbitron tracking-tight">R$ 59,99</span>
                <span className="text-zinc-500">/ano</span>
              </div>
              <p className="text-cyan-400 text-sm mt-2 font-medium">
                R$ 5/mês · Em 1.000 membros vira R$ 99
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex items-center justify-center gap-3 w-full h-[68px] bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white rounded-xl font-bold text-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
            >
              <Zap className="w-6 h-6" />
              <span className="font-orbitron tracking-wide">
                {loading ? 'Abrindo checkout...' : 'Quero o arsenal — R$ 59,99'}
              </span>
            </button>

            <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Garantia 7 dias · Acesso imediato · Cancele quando quiser
            </p>
          </div>
        </div>

        {/* Garantia e ROI */}
        <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <Shield className="w-10 h-10 text-green-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white mb-2">Garantia incondicional</h4>
              <p className="text-sm text-zinc-400">
                7 dias para testar. Não gostou? Devolvemos 100% do valor, sem perguntas.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <Zap className="w-10 h-10 text-cyan-400 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white mb-2">ROI garantido</h4>
              <p className="text-sm text-zinc-400">
                Um único cliente ou projeto paga o Premium inteiro. O resto é lucro.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
