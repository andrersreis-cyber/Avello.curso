'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, ShoppingBag } from 'lucide-react'

export default function LojaSucessoError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Loja sucesso error:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Erro ao confirmar pagamento</h2>
        <p className="text-zinc-400 mb-8">
          Ocorreu um problema ao verificar seu pagamento. Se o valor foi debitado, seu acesso será liberado em instantes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar novamente
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Ir para área de membros
          </Link>
        </div>
      </div>
    </div>
  )
}
