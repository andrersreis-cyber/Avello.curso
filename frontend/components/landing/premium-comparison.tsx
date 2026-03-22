'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Check, Zap, Crown, Shield, Star, ShoppingCart } from 'lucide-react'

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

const starterFeatures = [
  '20 Templates n8n selecionados',
  '3 downloads/semana',
  'Uso comercial permitido',
  'Comunidade Telegram',
  'Visualização de todos os recursos'
]

const premiumFeatures = [
  'Tudo do Starter +',
  '+2500 Templates n8n completos',
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
  const { vagas, toast } = usePurchaseSimulator()
  const preenchidas = 1000 - vagas
  const percentual = (preenchidas / 1000) * 100
  const [showProPlan, setShowProPlan] = useState(false)

  return (
    <section id="precos" className="py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Urgency Banner + barra de progresso com simulador */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-3 px-6 py-4 bg-orange-500/10 rounded-xl border border-orange-500/30 min-w-[320px]">
            <span className="text-sm text-orange-400 font-semibold">
              Preço de lançamento — sobe para R$97/ano após 1.000 membros
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
            Escolha seu plano e comece agora
          </h2>
          <p className="text-zinc-400 text-lg">
            Todos os planos com <span className="text-white font-semibold">garantia de 7 dias</span>. Não gostou? Devolvemos 100%.
          </p>
        </div>

        {/* Comparison Grid - 2 planos principais (Hick's Law: menos opções = mais conversão) */}
        <div className={`grid gap-6 lg:gap-8 ${showProPlan ? 'md:grid-cols-3' : 'md:grid-cols-2 max-w-3xl mx-auto'}`}>
          {/* Plano Starter */}
          <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-zinc-400" />
                <h3 className="text-xl font-bold text-white">Plano Starter</h3>
              </div>
              <p className="text-zinc-400 text-sm">Para conhecer a plataforma e começar com o essencial</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">R$ 14,90</span>
                <span className="text-zinc-500">/ano</span>
              </div>
              <p className="text-zinc-400 text-sm mt-2">R$ 1,24/mês</p>
            </div>

            <ul className="space-y-3 mb-8">
              {starterFeatures.map((feature, index) => (
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
              Começar por R$ 14,90/ano
            </Link>

            <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Garantia de 7 dias
            </p>
          </div>

          {/* Plano Premium - MAIS POPULAR */}
          <div className="relative -mt-4 md:mt-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
              MAIS POPULAR
            </div>
            
            <div className="mb-6 mt-2">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">Plano Premium</h3>
              </div>
              <p className="text-zinc-400 text-sm">O plano ideal para quem quer transformar IA em renda — vender, implementar e escalar</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded border border-red-500/30">
                  LANÇAMENTO
                </span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">
                  −60% OFF
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-xl text-zinc-500 line-through font-medium">R$ 97</span>
                <span className="text-5xl font-bold text-white">R$ 39</span>
                <span className="text-zinc-500">/ano</span>
              </div>
              <p className="text-cyan-400 text-sm mt-2 font-medium">
                R$ 3,25/mês • Você economiza R$ 58/ano
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
              Começar Agora
            </Link>
            
            <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
              <Shield className="w-3 h-3" />
              Garantia de 7 dias ou seu dinheiro de volta
            </p>
          </div>

          {/* Plano Premium Pro — colapsado por padrão (Hick's Law) */}
          {showProPlan && (
            <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/30">
              <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-zinc-900 text-xs font-bold rounded-full">
                NOVO
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <h3 className="text-xl font-bold text-white">Plano Premium Pro</h3>
                </div>
                <p className="text-zinc-400 text-sm">Para agências, implementadores e quem quer aceleração com suporte próximo</p>
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

              <p className="text-center text-xs text-zinc-500 mt-4 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Garantia de 7 dias
              </p>
            </div>
          )}
        </div>

        {/* Toggle Premium Pro — não poluir visão principal */}
        {!showProPlan && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowProPlan(true)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
            >
              Ver também o Plano Premium Pro (agências e implementadores)
            </button>
          </div>
        )}

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
