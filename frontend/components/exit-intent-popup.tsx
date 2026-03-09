'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Shield, Zap, Clock } from 'lucide-react'
import { ProductId } from '@/lib/stripe'

type ExitIntentPopupProps = {
  onCheckout: (productId: ProductId) => Promise<void> | void
  loading: boolean
}

export function ExitIntentPopup({ onCheckout, loading }: ExitIntentPopupProps) {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const triggerPopup = useCallback(() => {
    // Mostrar apenas 1x por sessão
    if (dismissed) return
    const shown = sessionStorage.getItem('exit_intent_shown')
    if (shown) return

    setShow(true)
    sessionStorage.setItem('exit_intent_shown', 'true')

    // Track Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', 'ExitIntent', { page: 'loja' })
    }
  }, [dismissed])

  useEffect(() => {
    // Desktop: mouse sai da viewport
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) triggerPopup()
    }

    // Mobile: inatividade de 45s
    let mobileTimer: ReturnType<typeof setTimeout>
    const resetTimer = () => {
      clearTimeout(mobileTimer)
      mobileTimer = setTimeout(triggerPopup, 45000)
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('touchstart', resetTimer)
    document.addEventListener('scroll', resetTimer)
    resetTimer()

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('touchstart', resetTimer)
      document.removeEventListener('scroll', resetTimer)
      clearTimeout(mobileTimer)
    }
  }, [triggerPopup])

  const handleClose = () => {
    setShow(false)
    setDismissed(true)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-zinc-900 rounded-2xl border border-cyan-500/30 max-w-lg w-full overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Espera! Antes de sair...
          </h2>
          <p className="text-zinc-400 mb-6">
            O Premium custa <span className="text-white font-semibold">R$3,25/mês</span>.
            Um único projeto de R$250 paga o ano inteiro. E se não gostar,
            devolvemos 100% em até 7 dias.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Shield className="w-4 h-4 text-green-400" />
              Garantia 7 dias
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Zap className="w-4 h-4 text-cyan-400" />
              Acesso imediato
            </div>
          </div>

          <button
            onClick={() => onCheckout('lowtik')}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mb-3"
          >
            <Zap className="w-5 h-5" />
            Assinar Premium — R$ 39/ano
          </button>

          <button
            onClick={handleClose}
            className="w-full py-3 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            Não, obrigado
          </button>
        </div>
      </div>
    </div>
  )
}
