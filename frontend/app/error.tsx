'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-6">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Algo deu errado</h2>
        <p className="text-zinc-400 mb-8">
          Ocorreu um erro inesperado. Tente novamente ou recarregue a página.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
