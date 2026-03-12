'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ContentCard } from './content-card'
import { UpgradeModal } from './upgrade-modal'

const WorkflowModal = dynamic(() => import('./workflow-modal').then(m => ({ default: m.WorkflowModal })), { ssr: false })
const PromptModal = dynamic(() => import('./prompt-modal').then(m => ({ default: m.PromptModal })), { ssr: false })
const TypebotModal = dynamic(() => import('./typebot-modal').then(m => ({ default: m.TypebotModal })), { ssr: false })
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { getDownloadCount, incrementDownload, canDownload, DOWNLOAD_LIMIT } from '@/lib/download-tracker'

type BonusData = {
  id: number
  nome: string
  descricao: string
  imagem_url?: string
  link?: string
  bonus_items?: {
    id: number
    titulo: string
    descricao?: string
    link?: string
    ordem: number
  }[]
}

type ContentItem = {
  id: string
  title: string
  description?: string
  tags?: string[]
  type: 'workflow' | 'prompt' | 'template' | 'saas' | 'tool' | 'bonus'
  imageUrl?: string
  url?: string
  copyContent?: string
  downloadData?: object
  bonusData?: BonusData
  originalName?: string // Para templates Typebot
}

type ContentGridProps = {
  items: ContentItem[]
  viewMode: 'grid' | 'list'
  loading?: boolean
  onBonusClick?: (bonus: BonusData) => void
  onWorkflowClick?: (item: ContentItem) => Promise<ContentItem> // Novo: carrega dados completos do workflow
  isLocked?: boolean // Módulo está bloqueado para usuários free
  getItemLocked?: (item: ContentItem, index: number) => boolean // Bloqueio por item (ex: 100 primeiros liberados para free)
}

export function ContentGrid({ items, viewMode, loading, onBonusClick, onWorkflowClick, isLocked = false, getItemLocked }: ContentGridProps) {
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [downloadCountVersion, setDownloadCountVersion] = useState(0)
  const { isPremium, isStarter } = useAuth()

  const refreshDownloadCount = useCallback(() => setDownloadCountVersion(v => v + 1), [])

  if (loading) {
    return (
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "flex flex-col gap-3"
      )}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden animate-pulse"
          >
            <div className="aspect-[16/9] bg-zinc-700" />
            <div className="p-4">
              <div className="h-5 bg-zinc-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-zinc-700 rounded w-full mb-2" />
              <div className="h-4 bg-zinc-700 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Nenhum resultado encontrado
        </h3>
        <p className="text-zinc-400">
          Tente ajustar sua busca ou selecione outro módulo
        </p>
      </div>
    )
  }

  const handleDownload = (item: ContentItem) => {
    if (item.downloadData) {
      const blob = new Blob([JSON.stringify(item.downloadData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      if (isStarter) {
        incrementDownload()
        refreshDownloadCount()
      }
    }
  }

  const isItemLocked = (item: ContentItem, index: number) => {
    if (isLocked && !isPremium) return true
    return getItemLocked?.(item, index) ?? false
  }

  const handleCardClick = async (item: ContentItem, index: number) => {
    // Se item está bloqueado, mostra modal de upgrade
    if (isItemLocked(item, index)) {
      setShowUpgradeModal(true)
      return
    }
    
    // Para workflows, carregar dados completos antes de abrir modal
    if (item.type === 'workflow' && onWorkflowClick) {
      const fullItem = await onWorkflowClick(item)
      setSelectedItem(fullItem)
      return
    }
    
    // Abre modal para templates e prompts
    if (item.type === 'template' || item.type === 'prompt') {
      setSelectedItem(item)
    } else if (item.type === 'bonus' && item.bonusData && onBonusClick) {
      // Para bônus, abre o modal de detalhes
      onBonusClick(item.bonusData)
    } else if (item.url && (item.url.startsWith('https://') || item.url.startsWith('http://'))) {
      // Para SaaS, tools com URL, abre em nova aba (validado para segurança)
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleDownloadClick = (item: ContentItem, index: number) => {
    if (isItemLocked(item, index)) {
      setShowUpgradeModal(true)
      return
    }
    // Starter: limite de 3 downloads/semana
    if (isStarter && !canDownload(isStarter)) {
      setShowUpgradeModal(true)
      return
    }
    handleDownload(item)
  }

  return (
    <>
      {/* Banner de conteúdo bloqueado (módulo inteiro) */}
      {isLocked && !isPremium && (
        <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-white font-medium">Conteúdo Premium</p>
              <p className="text-sm text-zinc-400">Visualize o conteúdo, mas faça upgrade para acessar</p>
            </div>
          </div>
          <Link
            href="/loja"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium text-sm transition-all"
          >
            Fazer Upgrade
          </Link>
        </div>
      )}

      {/* Banner parcial: templates liberados para Starter + contador de downloads */}
      {!isLocked && getItemLocked && isStarter && (
        <div className="mb-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl">📦</span>
            <div>
              <p className="text-white font-medium">20 templates liberados</p>
              <p className="text-sm text-zinc-400">
                Faça upgrade para desbloquear todos os +2.500 templates •{' '}
                <span className="text-cyan-400 font-medium">
                  {getDownloadCount()}/{DOWNLOAD_LIMIT} downloads esta semana
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/loja"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium text-sm transition-all"
          >
            Fazer Upgrade
          </Link>
        </div>
      )}

      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "flex flex-col gap-3"
      )}>
        {items.map((item, index) => {
          const locked = isItemLocked(item, index)
          return (
            <ContentCard
              key={item.id}
              title={item.title}
              description={item.description}
              tags={item.tags}
              type={item.type}
              imageUrl={item.imageUrl}
              url={item.url}
              copyContent={locked ? undefined : item.copyContent}
              onClick={() => handleCardClick(item, index)}
              onDownload={item.downloadData ? () => handleDownloadClick(item, index) : undefined}
              isLocked={locked}
            />
          )
        })}
      </div>

      {/* Modal para Workflows n8n */}
      {selectedItem && selectedItem.type === 'workflow' && (
        <WorkflowModal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          description={selectedItem.description}
          jsonData={selectedItem.downloadData}
          tags={selectedItem.tags}
          onDownload={
            isStarter
              ? () => {
                  if (!canDownload(isStarter)) {
                    setSelectedItem(null)
                    setShowUpgradeModal(true)
                    return
                  }
                  if (selectedItem.downloadData) {
                    const blob = new Blob([JSON.stringify(selectedItem.downloadData, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${selectedItem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                    incrementDownload()
                    refreshDownloadCount()
                  }
                }
              : undefined
          }
        />
      )}

      {/* Modal para Templates Typebot */}
      {selectedItem && selectedItem.type === 'template' && (
        <TypebotModal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          originalName={selectedItem.originalName}
          description={selectedItem.description}
          driveUrl={selectedItem.url}
          tags={selectedItem.tags}
        />
      )}

      {/* Modal para Prompts */}
      {selectedItem && selectedItem.type === 'prompt' && (
        <PromptModal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={selectedItem.title}
          content={selectedItem.copyContent || ''}
        />
      )}

      {/* Modal de Upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  )
}
