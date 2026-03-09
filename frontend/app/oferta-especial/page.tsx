'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Zap, Shield, Clock, AlertTriangle, Check, Crown, Loader2, X, DollarSign } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { getAffiliateCookie } from '@/lib/affiliate'

const OFFER_DURATION = 10 * 60

const OFFER_DATA: Record<string, {
  nome: string
  precoOriginal: string
  precoDesconto: string
  economia: string
  porMes: string
}> = {
  lowtik: {
    nome: 'Premium',
    precoOriginal: 'R$ 39',
    precoDesconto: 'R$ 29',
    economia: 'R$ 10',
    porMes: 'R$ 2,42',
  },
  starter: {
    nome: 'Starter',
    precoOriginal: 'R$ 14,90',
    precoDesconto: 'R$ 9,90',
    economia: 'R$ 5',
    porMes: 'R$ 0,82',
  },
}

function OfertaContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plano = searchParams.get('plano') || 'lowtik'
  const offer = OFFER_DATA[plano] || OFFER_DATA.lowtik
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(OFFER_DURATION)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const savedExpiry = sessionStorage.getItem('oferta_expiry')
    let expiryTime: number
    if (savedExpiry) {
      expiryTime = parseInt(savedExpiry, 10)
    } else {
      expiryTime = Date.now() + OFFER_DURATION * 1000
      sessionStorage.setItem('oferta_expiry', String(expiryTime))
    }
    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0) {
        setExpired(true)
        sessionStorage.removeItem('oferta_expiry')
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (expired) {
      const timer = setTimeout(() => router.push('/loja'), 3000)
      return () => clearTimeout(timer)
    }
  }, [expired, router])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const handleCheckoutDesconto = async () => {
    setLoading(true)
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: `${offer.nome} (Oferta Especial)`,
        value: plano === 'lowtik' ? 29 : 9.9,
        currency: 'BRL',
      })
    }
    try {
      const response = await fetch('/api/checkout-desconto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: plano,
          affiliateCode: getAffiliateCookie(),
          customerEmail: user?.email,
        }),
      })
      const data = await response.json()
      if (data.url) window.location.href = data.url
      else alert('Erro ao processar. Tente novamente.')
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Oferta expirada</h1>
          <p className="text-zinc-400 mb-6">O tempo acabou. Redirecionando...</p>
          <button onClick={() => router.push('/loja')} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all">
            Ir para a Loja
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Barra de urgência fixa */}
      <div className="sticky top-0 z-50 bg-red-600 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-1">
          <span className="text-white/90 text-xs">Esta condição aparece só agora para novos membros. Saindo da página, o valor volta ao normal.</span>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-white animate-pulse" />
            <span className="font-bold text-white text-sm md:text-base">OFERTA EXPIRA EM:</span>
          <div className="flex items-center gap-1 font-mono">
            <span className="bg-white/20 px-2 py-1 rounded text-lg font-bold">{String(minutes).padStart(2, '0')}</span>
            <span className="text-xl font-bold">:</span>
            <span className="bg-white/20 px-2 py-1 rounded text-lg font-bold">{String(seconds).padStart(2, '0')}</span>
          </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Hook — Dor */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Enquanto você pensa,<br />
            <span className="text-cyan-400">seus concorrentes já estão faturando.</span>
          </h1>
          <p className="text-lg text-zinc-300 mb-4">
            Cada dia sem automação é dinheiro que você está <span className="text-red-400 font-semibold">deixando na mesa</span>.
          </p>
          <p className="text-zinc-400">
            Aquele projeto de R$ 500 que você poderia entregar amanhã?
            Alguém com acesso à Avello já está entregando <span className="text-white font-medium">hoje</span>.
          </p>
        </div>

        {/* O que está perdendo */}
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6 mb-8">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            O que você está perdendo AGORA:
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3"><X className="w-4 h-4 text-red-400 mt-1 shrink-0" /><span className="text-zinc-300">Chatbots que vendem no automático enquanto você dorme</span></div>
            <div className="flex items-start gap-3"><X className="w-4 h-4 text-red-400 mt-1 shrink-0" /><span className="text-zinc-300">Templates n8n prontos que empresas pagam R$ 500-2.000 para ter</span></div>
            <div className="flex items-start gap-3"><X className="w-4 h-4 text-red-400 mt-1 shrink-0" /><span className="text-zinc-300">Prompts que transformam horas de trabalho em minutos</span></div>
            <div className="flex items-start gap-3"><X className="w-4 h-4 text-red-400 mt-1 shrink-0" /><span className="text-zinc-300">SaaS white-label que você revende por R$ 97/mês</span></div>
          </div>
        </div>

        {/* Bloco ROI */}
        <div className="bg-green-500/10 rounded-2xl border border-green-500/30 p-6 mb-8">
          <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            O upgrade se paga rápido
          </h3>
          <p className="text-zinc-300 mb-2">
            O upgrade se paga quando você vende uma automação simples, implementa um chatbot ou economiza horas com prompts.
          </p>
          <p className="text-zinc-400 text-sm">
            Economizar alguns reais agora é menos inteligente do que liberar acesso total e aumentar a chance de retorno rápido.
          </p>
        </div>

        {/* Oferta */}
        <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-2xl border-2 border-cyan-500/40 p-8 mb-8 text-center relative overflow-hidden">
          <div className="absolute -top-1 -right-1 px-4 py-2 bg-red-600 rounded-bl-2xl">
            <span className="text-white text-sm font-bold">ECONOMIA DE {offer.economia}</span>
          </div>
          <Crown className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Última chance: {offer.nome} com desconto</h2>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl text-zinc-500 line-through">{offer.precoOriginal}</span>
            <span className="text-5xl font-bold text-white">{offer.precoDesconto}</span>
            <span className="text-zinc-400">/ano</span>
          </div>
          <p className="text-cyan-400 mb-6">Apenas {offer.porMes}/mês</p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 text-left mb-8 max-w-md mx-auto">
            {plano === 'lowtik' ? (
              <>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">+2.500 Templates n8n</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">+500 Chatbots</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">+2.400 Prompts</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">+14 mil ferramentas IA</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">Downloads ilimitados</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">Comunidade Telegram</span></div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">20 Templates n8n</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">3 downloads/semana</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">Uso comercial</span></div>
                <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-400 shrink-0" /><span className="text-sm text-zinc-300">Comunidade Telegram</span></div>
              </>
            )}
          </div>

          <button
            onClick={handleCheckoutDesconto}
            disabled={loading}
            className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-cyan-500/25"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Zap className="w-6 h-6" />GARANTIR DESCONTO — {offer.precoDesconto}/ano</>}
          </button>

          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400"><Shield className="w-4 h-4 text-green-400" />Garantia 7 dias</div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400"><Clock className="w-4 h-4 text-cyan-400" />Acesso imediato</div>
          </div>
        </div>

        {/* Urgência final */}
        <div className="text-center">
          <p className="text-zinc-500 text-sm mb-2">
            Esta oferta expira em <span className="text-red-400 font-bold">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
          </p>
          <p className="text-zinc-600 text-xs">Após o tempo, o preço volta para {offer.precoOriginal}. Sem exceções.</p>
          <button onClick={() => router.push('/loja')} className="mt-6 text-zinc-600 hover:text-zinc-400 text-xs transition-colors">
            Não, prefiro pagar o preço cheio
          </button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
    </div>
  )
}

export default function OfertaEspecialPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OfertaContent />
    </Suspense>
  )
}
