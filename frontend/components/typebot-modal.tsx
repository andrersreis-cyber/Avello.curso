'use client'

import { X, ExternalLink, Bot, MessageSquare, Sparkles } from 'lucide-react'
import { useEffect } from 'react'

type TypebotModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  originalName?: string
  description?: string
  driveUrl?: string
  tags?: string[]
}

export function TypebotModal({ isOpen, onClose, title, originalName, description, driveUrl, tags }: TypebotModalProps) {
  // Fechar com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden m-4">
        {/* Header com ícone */}
        <div className="relative p-6 pb-4 border-b border-zinc-800">
          {/* Ícone do Typebot */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                Template Typebot
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Título */}
          <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
          
          {/* Nome Original (se diferente) */}
          {originalName && originalName !== title && (
            <p className="text-sm text-zinc-500">
              <span className="text-zinc-600">Nome Original:</span> {originalName}
            </p>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          {/* Descrição */}
          {description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Descrição
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, i) => (
                <span 
                  key={i} 
                  className="text-xs px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Info box */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-purple-300 font-medium mb-1">
                  Template para Typebot
                </p>
                <p className="text-xs text-zinc-400">
                  Este é um template de chatbot para a plataforma Typebot. 
                  Clique em "Acessar Modelo" para baixar o arquivo JSON e importar no seu Typebot.
                </p>
              </div>
            </div>
          </div>

          {/* Botão de acesso */}
          {driveUrl && (
            <a
              href={driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              Acessar Modelo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
