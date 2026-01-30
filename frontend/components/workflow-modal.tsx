'use client'

import { X, Download, Copy, Check, Cpu, Zap, Link2, HardDrive } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { analyzeWorkflow } from '@/lib/workflow-analyzer'

type WorkflowModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  jsonData?: object
  tags?: string[]
}

export function WorkflowModal({ isOpen, onClose, title, description, jsonData, tags }: WorkflowModalProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview')

  // Analisar o workflow
  const analysis = useMemo(() => {
    return analyzeWorkflow(jsonData, title)
  }, [jsonData, title])

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

  const jsonString = jsonData ? JSON.stringify(jsonData, null, 2) : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${analysis.titlePt.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-800">
          <div className="flex-1 pr-4">
            {/* Categoria Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 font-medium">
                {analysis.category}
              </span>
              {analysis.hasAI && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  IA
                </span>
              )}
            </div>
            
            {/* Título em Português */}
            <h2 className="text-xl font-bold text-white mb-2">{analysis.titlePt}</h2>
            
            {/* Título Original (menor) */}
            {analysis.titlePt !== title && (
              <p className="text-xs text-zinc-500 mb-2">Original: {title}</p>
            )}
            
            {/* Descrição Gerada */}
            <p className="text-sm text-zinc-400">{analysis.descriptionPt}</p>
            
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('preview')}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-colors",
              activeTab === 'preview'
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-zinc-400 hover:text-white"
            )}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={cn(
              "px-6 py-3 text-sm font-medium transition-colors",
              activeTab === 'json'
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-zinc-400 hover:text-white"
            )}
          >
            JSON
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'preview' ? (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{analysis.nodeCount}</div>
                    <div className="text-sm text-zinc-400">Nodes</div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Cpu className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{analysis.integrations.length}</div>
                    <div className="text-sm text-zinc-400">Integrações</div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Link2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{analysis.connectionCount}</div>
                    <div className="text-sm text-zinc-400">Conexões</div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <HardDrive className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{analysis.size}</div>
                    <div className="text-sm text-zinc-400">Tamanho</div>
                  </div>
                </div>
              </div>

              {/* Triggers */}
              {analysis.triggers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Como é acionado</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.triggers.map((trigger, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-green-500/10 text-green-300 rounded-lg text-sm"
                      >
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Integrações */}
              {analysis.integrations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">Integrações utilizadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.integrations.map((integration, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded-lg text-sm"
                      >
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nodes List */}
              {analysis.nodes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-zinc-300 mb-3">
                    Nodes do Workflow ({analysis.nodes.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {analysis.nodes.map((node, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center text-xs font-bold text-zinc-400">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate">{node.namePt}</div>
                          <div className="text-xs text-zinc-500 truncate">
                            {node.typePt}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {analysis.nodes.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-zinc-400">
                    Este workflow não possui nodes definidos ou o JSON está em formato diferente.
                  </p>
                  <p className="text-zinc-500 text-sm mt-2">
                    Clique na aba "JSON" para ver o conteúdo completo.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <pre className="bg-zinc-950 rounded-xl p-4 overflow-x-auto text-sm text-zinc-300 font-mono max-h-[50vh]">
                <code>{jsonString || 'Nenhum JSON disponível'}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800">
          <button
            onClick={handleCopy}
            disabled={!jsonString}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              copied
                ? "bg-green-600 text-white"
                : "bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50"
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
                Copiar JSON
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={!jsonString}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download JSON
          </button>
        </div>
      </div>
    </div>
  )
}
