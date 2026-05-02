'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Shield, Loader2, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getAffiliateCookie } from '@/lib/affiliate'

const features = [
  '+2.000 Templates n8n (uso comercial)',
  '+3.500 Prompts ChatGPT',
  '+3.500 Prompts Midjourney',
  '+3.000 Templates Typebot',
  '+14 mil Ferramentas IA',
  '+350 Self-Hosted Apps',
  '+30 SaaS White Label',
  '+8 Bônus Exclusivos',
  'Grupo VIP no Telegram',
  'Skills do Claude Code (atualizadas toda semana)',
  'Acesso imediato após o pagamento',
]

export default function EscolherPlanoPage() {
  const [loading, setLoading] = useState(false)
  const { user, signOut } = useAuth()

  const handleCheckout = async () => {
    setLoading(true)

    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: 'Operador Anual',
        value: 59.99,
        currency: 'BRL',
      })
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'operador_anual',
          affiliateCode: getAffiliateCookie(),
          customerEmail: user?.email,
        }),
      })
      const data = await response.json()
      if (data.url) window.location.href = data.url
    } catch {
      // silently fail — user sees loading reset
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full">

        {/* Indicador de etapas */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm text-zinc-400">Conta criada</span>
          </div>
          <div className="w-12 h-px bg-zinc-700" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold text-white">2</div>
            <span className="text-sm font-medium text-white">Ativar acesso</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Último passo. Pague e o acesso é seu na hora.
          </h1>
          <p className="text-zinc-400">
            Assim que o pagamento for confirmado, sua conta é ativada automaticamente.
          </p>
        </div>

        {/* Card do plano */}
        <div className="relative bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10 mb-6">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full">
            ACESSO COMPLETO
          </div>

          <div className="flex items-center gap-2 mb-4 mt-1">
            <Crown className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold">Operador Anual</h2>
          </div>

          <div className="mb-1">
            <span className="text-5xl font-bold">R$ 59,99</span>
            <span className="text-zinc-500">/ano</span>
          </div>
          <p className="text-cyan-400 text-sm mb-6">R$ 5/mês • Tudo desbloqueado por 12 meses</p>

          <ul className="space-y-2 mb-8">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-zinc-300">{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Pagar R$ 59,99 e ativar agora
              </>
            )}
          </button>

          {/* Aviso de acesso imediato */}
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-zinc-400">
            <Lock className="w-4 h-4 text-green-400" />
            <span>Pagamento seguro · Acesso liberado na hora · Garantia de 7 dias</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={signOut}
            className="text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  )
}
