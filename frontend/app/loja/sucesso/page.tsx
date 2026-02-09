'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle2, 
  ArrowRight, 
  Mail, 
  MessageCircle,
  Sparkles,
  PartyPopper,
  Loader2
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useAuth } from '@/contexts/auth-context'

function SucessoContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [showConfetti, setShowConfetti] = useState(false)
  const [isProcessing, setIsProcessing] = useState(true)
  const { isPremium, refreshProfile } = useAuth()
  
  // Polling inteligente para aguardar webhook processar
  useEffect(() => {
    let attempts = 0
    const maxAttempts = 10 // 20 segundos máximo
    
    const checkPremiumStatus = async () => {
      console.log(`🔄 Verificando status premium (tentativa ${attempts + 1}/${maxAttempts})`)
      
      // Revalidar perfil do usuário
      await refreshProfile()
      
      attempts++
      
      // Se já é premium, parar polling
      if (isPremium) {
        console.log('✅ Usuário agora é premium!')
        setIsProcessing(false)
        return
      }
      
      // Se atingiu máximo de tentativas, parar
      if (attempts >= maxAttempts) {
        console.log('⚠️ Máximo de tentativas atingido. Webhook pode estar atrasado.')
        setIsProcessing(false)
        return
      }
      
      // Tentar novamente em 2 segundos
      setTimeout(checkPremiumStatus, 2000)
    }
    
    // Iniciar polling após 1 segundo (dar tempo pro webhook)
    const timer = setTimeout(checkPremiumStatus, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  useEffect(() => {
    // Track Facebook Pixel - Purchase (conversão)
    if (typeof window !== 'undefined' && window.fbq && sessionId) {
      window.fbq('track', 'Purchase', {
        content_type: 'product',
        currency: 'BRL',
      })
    }
    
    // Dispara confetti ao carregar (apenas quando não está mais processando)
    if (!showConfetti && !isProcessing) {
      setShowConfetti(true)
      
      const duration = 3000
      const end = Date.now() + duration
      
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#06b6d4', '#3b82f6', '#8b5cf6']
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#06b6d4', '#3b82f6', '#8b5cf6']
        })
        
        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      
      frame()
    }
  }, [showConfetti, isProcessing])

  // Mostrar loading enquanto processa
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Processando seu pagamento...
          </h1>
          
          <p className="text-zinc-400 mb-8">
            Aguarde enquanto confirmamos sua compra e liberamos seu acesso premium.
            <br />
            Isso pode levar alguns segundos.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span>Verificando status...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 w-32 h-32 bg-green-500/20 rounded-full blur-xl" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2">
            <PartyPopper className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {isPremium ? 'Pagamento Confirmado!' : 'Pagamento Recebido!'}
        </h1>
        
        <p className="text-xl text-zinc-300 mb-2">
          Bem-vindo à família Avello! 🎉
        </p>
        
        <p className="text-zinc-400 mb-8">
          Seu acesso foi liberado com sucesso. Você já pode explorar todos os recursos disponíveis.
        </p>

        {/* Next Steps */}
        <div className="bg-zinc-800/50 rounded-2xl p-6 mb-8 text-left border border-zinc-700">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Próximos passos
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-400">1</span>
              </div>
              <div>
                <p className="text-white font-medium">Acesse a Área de Membros</p>
                <p className="text-sm text-zinc-400">Explore todos os templates, prompts e ferramentas</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-400">2</span>
              </div>
              <div>
                <p className="text-white font-medium">Entre na Comunidade</p>
                <p className="text-sm text-zinc-400">Conecte-se com outros membros no Telegram</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cyan-400">3</span>
              </div>
              <div>
                <p className="text-white font-medium">Verifique seu email</p>
                <p className="text-sm text-zinc-400">Enviamos os detalhes da sua compra</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all"
          >
            Acessar Área de Membros
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <a
            href="https://t.me/+LgHnVN3B_81hYzA5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all border border-zinc-700"
          >
            <MessageCircle className="w-5 h-5" />
            Entrar na Comunidade
          </a>
        </div>

        {/* Support */}
        <p className="text-zinc-500 text-sm mt-8">
          Dúvidas? Entre em contato:{' '}
          <a href="mailto:suporte@avello.com.br" className="text-cyan-400 hover:underline">
            suporte@avello.com.br
          </a>
        </p>
        
        {sessionId && (
          <p className="text-zinc-600 text-xs mt-4">
            ID da transação: {sessionId.slice(0, 20)}...
          </p>
        )}
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

export default function SucessoPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SucessoContent />
    </Suspense>
  )
}
