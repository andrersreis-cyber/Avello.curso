'use client'

import { X, ExternalLink, Download, Gift, Sparkles, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type BonusItem = {
  id: number
  titulo: string
  descricao?: string
  link?: string
  ordem: number
}

type BonusModalProps = {
  isOpen: boolean
  onClose: () => void
  bonus: {
    id: number
    nome: string
    descricao: string
    imagem_url?: string
    link?: string
    bonus_items?: BonusItem[]
  } | null
}

export function BonusModal({ isOpen, onClose, bonus }: BonusModalProps) {
  if (!isOpen || !bonus) return null

  const items = bonus.bonus_items || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden flex flex-col">
        {/* Header com imagem */}
        <div className="relative h-48 overflow-hidden shrink-0">
          {bonus.imagem_url ? (
            <img 
              src={bonus.imagem_url} 
              alt={bonus.nome}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center">
              <Gift className="w-20 h-20 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Bônus Exclusivo</span>
          </div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-zinc-900/80 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
          
          {/* Title */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white">{bonus.nome}</h2>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Descrição */}
          <p className="text-zinc-400 mb-6 leading-relaxed whitespace-pre-line">
            {bonus.descricao}
          </p>
          
          {/* Link principal do bônus (se houver) */}
          {bonus.link && (
            <a
              href={bonus.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-xl font-medium transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              Acessar Recurso Principal
            </a>
          )}
          
          {/* Lista de itens */}
          {items.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-yellow-400" />
                Conteúdos Inclusos ({items.length})
              </h3>
              
              <div className="space-y-3">
                {items.sort((a, b) => a.ordem - b.ordem).map((item) => (
                  <div 
                    key={item.id}
                    className={cn(
                      "p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50",
                      item.link && "hover:border-yellow-500/50 hover:bg-zinc-800 transition-all"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white mb-1">{item.titulo}</h4>
                        {item.descricao && (
                          <p className="text-sm text-zinc-400 line-clamp-2">{item.descricao}</p>
                        )}
                      </div>
                      
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-2 px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors"
                        >
                          {item.link.includes('drive.google') ? (
                            <>
                              <Download className="w-4 h-4" />
                              Baixar
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              Acessar
                            </>
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Mensagem se não houver itens */}
          {items.length === 0 && !bonus.link && (
            <div className="text-center py-8 text-zinc-500">
              <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Este bônus não possui itens para download no momento.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
