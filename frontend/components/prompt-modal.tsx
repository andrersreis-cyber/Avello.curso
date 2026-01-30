'use client'

import { X, Copy, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

type PromptModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string
}

export function PromptModal({ isOpen, onClose, title, content }: PromptModalProps) {
  const [copied, setCopied] = useState(false)

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Contar palavras e caracteres
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const charCount = content.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-800">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-500/20 text-green-400">
                Prompt
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 px-6 py-3 border-b border-zinc-800 bg-zinc-800/30">
          <div className="text-sm">
            <span className="text-zinc-500">Palavras:</span>{' '}
            <span className="text-white font-medium">{wordCount}</span>
          </div>
          <div className="text-sm">
            <span className="text-zinc-500">Caracteres:</span>{' '}
            <span className="text-white font-medium">{charCount}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors",
              copied
                ? "bg-green-600 text-white"
                : "bg-purple-600 hover:bg-purple-500 text-white"
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar Prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
