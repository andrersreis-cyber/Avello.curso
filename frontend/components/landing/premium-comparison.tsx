'use client'

import Link from 'next/link'
import { Check, Zap, Crown, Shield } from 'lucide-react'

const freeFeatures = [
  '+2000 Templates n8n',
  'Download ilimitado',
  'Uso comercial permitido',
  'Comunidade no Telegram',
  'Atualizações semanais'
]

const premiumFeatures = [
  'Tudo do plano Gratuito',
  '+500 Chatbots prontos',
  '+2400 Prompts ChatGPT',
  '+3500 Prompts Midjourney',
  '+3000 Templates Typebot',
  '+14 mil Ferramentas IA',
  '+350 Self-Hosted Apps',
  '+30 SaaS White Label',
  '+8 Bônus Exclusivos'
]

export function PremiumComparison() {
  return (
    <section id="precos" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comece grátis, upgrade quando quiser
          </h2>
          <p className="text-zinc-400 text-lg">
            Sem pegadinhas. Plano gratuito <span className="text-white font-semibold">vitalício</span>.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-zinc-400" />
                <h3 className="text-xl font-bold text-white">Plano Gratuito</h3>
              </div>
              <p className="text-zinc-400 text-sm">Perfeito para começar</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$ 0</span>
                <span className="text-zinc-500">/para sempre</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/cadastro"
              className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all border border-zinc-700"
            >
              Criar Conta Grátis
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="relative bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/30">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
              MAIS POPULAR
            </div>
            
            {/* Discount Badge */}
            <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full rotate-12 shadow-lg">
              80% OFF
            </div>
            
            <div className="mb-6 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Plano Premium</h3>
              </div>
              <p className="text-zinc-400 text-sm">Acesso completo por 12 meses</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl text-zinc-500 line-through">R$ 199</span>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30">
                  LANÇAMENTO
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$ 39</span>
                <span className="text-zinc-500">/ano</span>
              </div>
              <p className="text-cyan-400 text-sm mt-2 font-medium">
                Apenas R$ 3,25/mês • Menos que um café ☕
              </p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/loja"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              <Zap className="w-5 h-5" />
              Fazer Upgrade Agora
            </Link>
            
            <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Garantia de 7 dias ou seu dinheiro de volta
            </p>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-50 -z-10 blur-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
          </div>
        </div>

        {/* Urgency message */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <span className="text-sm text-orange-400">
              ⚠️ Preço promocional pode subir a qualquer momento
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
