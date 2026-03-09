'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Zap, Shield, Crown, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getAffiliateCookie } from '@/lib/affiliate'

export default function EscolherPlanoPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const { user, isPendente, signOut } = useAuth()

  const handleCheckout = async (productId: string) => {
    setLoading(productId)

    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: productId === 'lowtik' ? 'Premium (Upsell)' : 'Starter',
        value: productId === 'lowtik' ? 39 : 14.9,
        currency: 'BRL',
      })
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          affiliateCode: getAffiliateCookie(),
          customerEmail: user?.email,
        }),
      })
      const data = await response.json()
      if (data.url) window.location.href = data.url
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(null)
    }
  }

  // Comparativo de features
  const comparison = [
    { feature: 'Templates n8n', starter: '20', premium: '+2.500' },
    { feature: 'Chatbots prontos', starter: false, premium: '+500' },
    { feature: 'Prompts ChatGPT', starter: false, premium: '+2.400' },
    { feature: 'Prompts Midjourney', starter: false, premium: '+3.500' },
    { feature: 'Templates Typebot', starter: false, premium: '+3.000' },
    { feature: 'Ferramentas IA', starter: false, premium: '+14 mil' },
    { feature: 'Self-Hosted Apps', starter: false, premium: '+350' },
    { feature: 'SaaS White Label', starter: false, premium: '+30' },
    { feature: 'Bônus Exclusivos', starter: false, premium: '+8' },
    { feature: 'Downloads/semana', starter: '3', premium: 'Ilimitado' },
    { feature: 'Uso comercial', starter: true, premium: true },
    { feature: 'Comunidade Telegram', starter: true, premium: true },
    { feature: 'Garantia 7 dias', starter: true, premium: true },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          {isPendente ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/30 mb-4">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium">Escolha um plano para acessar a plataforma</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-4">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Conta criada com sucesso!</span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Você já entrou. Agora pegue o pacote completo que acelera sua monetização.
          </h1>
          <p className="text-zinc-400 text-lg">
            O Premium é o plano ideal para quem quer transformar IA em renda. Por apenas <span className="text-white font-semibold">+R$24</span> você desbloqueia
            <span className="text-cyan-400 font-semibold"> liberdade total de monetização</span>. Ou comece com o Starter e faça upgrade quando quiser.
          </p>
        </div>

        {/* Cards lado a lado */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Starter */}
          <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-zinc-400" />
              <h2 className="text-xl font-bold">Starter</h2>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold">R$ 14,90</span>
              <span className="text-zinc-500">/ano</span>
            </div>
            <button
              onClick={() => handleCheckout('starter')}
              disabled={loading !== null}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all border border-zinc-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading === 'starter' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Continuar com Starter'
              )}
            </button>
          </div>

          {/* Premium — DESTACADO */}
          <div className="relative bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-6 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full">
              RECOMENDADO
            </div>
            <div className="flex items-center gap-2 mb-4 mt-1">
              <Crown className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold">Premium</h2>
            </div>
            <div className="mb-2">
              <span className="text-4xl font-bold">R$ 39</span>
              <span className="text-zinc-500">/ano</span>
            </div>
            <p className="text-cyan-400 text-sm mb-6">
              +R$24 para desbloquear TUDO • R$ 3,25/mês
            </p>
            <button
              onClick={() => handleCheckout('lowtik')}
              disabled={loading !== null}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading === 'lowtik' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Quero o Premium
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabela comparativa */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-800/50 border-b border-zinc-700">
            <span className="text-sm font-medium text-zinc-400">Recurso</span>
            <span className="text-sm font-medium text-center text-zinc-400">Starter</span>
            <span className="text-sm font-medium text-center text-cyan-400">Premium</span>
          </div>
          {comparison.map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 p-4 border-b border-zinc-800/50 last:border-0">
              <span className="text-sm text-zinc-300">{row.feature}</span>
              <div className="flex justify-center">
                {row.starter === false ? (
                  <X className="w-4 h-4 text-zinc-600" />
                ) : row.starter === true ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <span className="text-sm text-zinc-400">{row.starter}</span>
                )}
              </div>
              <div className="flex justify-center">
                {row.premium === true ? (
                  <Check className="w-4 h-4 text-cyan-400" />
                ) : (
                  <span className="text-sm text-cyan-400 font-medium">{row.premium}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="text-center mt-6">
          <p className="text-zinc-500 text-sm">
            Garantia de 7 dias em ambos os planos • Pagamento seguro via Stripe
          </p>
          <button
            onClick={signOut}
            className="text-zinc-600 hover:text-zinc-400 text-xs mt-4 transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  )
}
