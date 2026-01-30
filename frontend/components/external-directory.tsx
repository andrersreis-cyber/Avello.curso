'use client'

import { useState } from 'react'
import { ExternalLink, Maximize2, Minimize2, RefreshCw, AlertCircle, ArrowLeft, Lock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type ExternalDirectoryProps = {
  url: string
  title: string
  description?: string
  isLocked?: boolean
}

export function ExternalDirectory({ url, title, description, isLocked = false }: ExternalDirectoryProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    setHasError(false)
    const iframe = document.getElementById('external-directory-iframe') as HTMLIFrameElement
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  return (
    <div className={cn(
      "flex flex-col h-full",
      isFullscreen && "fixed inset-0 z-50 bg-zinc-950"
    )}>
      {/* Barra de controle minimalista */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer" />
          </div>
          <div className="h-4 w-px bg-zinc-700" />
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/50 rounded-md">
            <span className="text-xs text-zinc-500">🔒</span>
            <span className="text-xs text-zinc-400 truncate max-w-[300px]">{url}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors"
            title="Recarregar"
          >
            <RefreshCw className={cn(
              "w-4 h-4 text-zinc-500 hover:text-zinc-300",
              isLoading && "animate-spin"
            )} />
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors"
            title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
            ) : (
              <Maximize2 className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
            )}
          </button>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors"
            title="Abrir em nova aba"
          >
            <ExternalLink className="w-4 h-4 text-zinc-500 hover:text-zinc-300" />
          </a>
        </div>
      </div>

      {/* Error state */}
      {hasError && (
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center bg-zinc-950">
          <AlertCircle className="w-16 h-16 text-red-400/50 mb-6" />
          <h3 className="text-xl font-semibold text-white mb-3">
            Não foi possível carregar o conteúdo
          </h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-md">
            O site pode estar bloqueando a exibição em iframes ou há um problema de conexão.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            Abrir em Nova Aba
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Loading state */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 top-10 flex items-center justify-center bg-zinc-950 z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-zinc-400">Carregando...</p>
          </div>
        </div>
      )}

      {/* Iframe - ocupa todo o espaço */}
      {!hasError && (
        <div className="flex-1 relative bg-zinc-950">
          <iframe
            id="external-directory-iframe"
            src={url}
            className={cn(
              "absolute inset-0 w-full h-full border-0",
              isLocked && "blur-sm pointer-events-none"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
          />
          
          {/* Overlay de bloqueio */}
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="text-center max-w-md p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Conteúdo Premium</h3>
                <p className="text-zinc-400 mb-6">
                  Este diretório está disponível apenas para membros Premium.
                </p>
                <Link
                  href="/loja"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all"
                >
                  <Zap className="w-5 h-5" />
                  Fazer Upgrade
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
