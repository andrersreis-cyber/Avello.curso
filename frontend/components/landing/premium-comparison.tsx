'use client'

import Link from 'next/link'
import { Check, Zap, Crown, Shield, Star } from 'lucide-react'

const freeFeatures = [
  '100 Templates n8n selecionados',
  '5 downloads/semana',
  'Uso comercial permitido',
  'Comunidade Telegram',
  'Visualização de todos os recursos'
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

const premiumProFeatures = [
  'Tudo do Premium',
  'Suporte prioritário WhatsApp',
  '1 consultoria mensal (1h)',
  'Acesso antecipado a novos recursos',
  'Comunidade VIP',
  '1 template customizado/mês'
]

export function PremiumComparison() {
  return (
    <section id="precos" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Urgency Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <span className="text-sm text-orange-400 font-medium">
              Preço de lançamento. Após 1.000 membros, Premium sobe para R$97/ano...
            </span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comece grátis, upgrade quando quiser
          </h2>
          <p className="text-zinc-400 text-lg">
            Sem pegadinhas. Plano gratuito <span className="text-white font-semibold">vitalício</span>.
          </p>
        </div>

        {/* Comparison Grid - 3 planos */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Plano Gratuito */}
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
                  <span className="text-zinc-300 text-sm">{feature}</span>
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

          {/* Plano Premium - MAIS POPULAR */}
          <div className="relative -mt-4 md:mt-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
              MAIS POPULAR
            </div>
            
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
                R$ 3,25/mês • Garantia 7 dias
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
          </div>

          {/* Plano Premium Pro */}
          <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/30">
            <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-900 text-xs font-bold rounded-full">
              NOVO
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Plano Premium Pro</h3>
              </div>
              <p className="text-zinc-400 text-sm">Para quem quer acelerar</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$ 97</span>
                <span className="text-zinc-500">/ano</span>
              </div>
              <p className="text-amber-400 text-sm mt-2 font-medium">
                R$ 8,08/mês
              </p>
            </div>
            
            <ul className="space-y-3 mb-8">
              {premiumProFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Link
              href="/loja?plano=premium-pro"
              className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl font-semibold transition-all border border-amber-500/40"
            >
              <Star className="w-5 h-5" />
              Quero Premium Pro
            </Link>
            
            <p className="text-center text-xs text-zinc-500 mt-4">
              Produto em breve no Stripe
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
