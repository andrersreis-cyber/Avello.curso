'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { SearchBar } from '@/components/search-bar'
import { ContentGrid } from '@/components/content-grid'
import { CategoryGrid } from '@/components/category-grid'
import { ExternalDirectory } from '@/components/external-directory'
import { SelfHostedDirectory } from '@/components/selfhosted-directory'
import { FreeToolsDirectory } from '@/components/free-tools-directory'
import { modules } from '@/lib/modules'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useModuleCounts } from '@/hooks/use-module-counts'
import { useModuleItems, type ContentItem } from '@/hooks/use-module-items'
import { useModuleCategories } from '@/hooks/use-module-categories'

const BonusModal = dynamic(() => import('@/components/bonus-modal').then(m => ({ default: m.BonusModal })), { ssr: false })
import { TimeLockedModule } from '@/components/time-locked-module'
import { MobileDrawer } from '@/components/mobile-drawer'
import { UpgradeBanner } from '@/components/upgrade-banner'

// Módulos disponíveis no plano Starter
const STARTER_MODULES = ['n8n-templates']

// Limite de templates n8n para plano Starter (os demais ficam bloqueados)
const STARTER_N8N_TEMPLATES_LIMIT = 20

// Módulos que usam iframe externo
const IFRAME_MODULES: Record<string, { url: string, title: string, description: string }> = {
  'ferramentas-ia': {
    url: 'https://aiagentsdirectory.com/landscape',
    title: 'AI Agents Directory',
    description: 'O maior diretório de agentes e ferramentas de IA do mundo'
  }
}

// Módulos com componentes especiais
const SPECIAL_MODULES = ['self-hosted', 'ferramentas-gratis']

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

// Módulos que usam visualização por categoria
const CATEGORY_MODULES = ['prompts-chatgpt', 'prompts-midjourney']

export default function MembersPage() {
  const [activeModule, setActiveModule] = useState('n8n-templates')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [categoryCount, setCategoryCount] = useState(0)
  const [selectedBonus, setSelectedBonus] = useState<BonusData | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<ContentItem | null>(null)
  const [workflowData, setWorkflowData] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  
  const { isPremium, isStarter, hasFullAccess, daysUntilFullAccess } = useAuth()
  const supabase = createClient()
  
  // Usar React Query para contagens (com cache)
  const { data: counts = {} } = useModuleCounts()

  // Módulos especiais que não usam dados do Supabase
  const isSpecialModule = ['ferramentas-ia', 'self-hosted', 'ferramentas-gratis'].includes(activeModule)
  
  // Buscar config do módulo atual
  const currentModuleConfig = modules.find(m => m.id === activeModule)
  
  // Verificar se módulo atual está bloqueado para usuários free
  const isModuleLocked = !STARTER_MODULES.includes(activeModule) && !isPremium
  
  // Verificar se módulo requer acesso total (7 dias de premium)
  const requiresFullAccess = currentModuleConfig?.requiresFullAccess || false
  const isModuleTimeLocked = requiresFullAccess && isPremium && !hasFullAccess

  // Verificar se módulo atual usa categorias
  const usesCategoryView = CATEGORY_MODULES.includes(activeModule) && !searchQuery && !isSpecialModule
  const showCategories = usesCategoryView && !selectedCategory

  // React Query para itens e categorias (com cache)
  const itemsQueryEnabled = !isSpecialModule && !showCategories
  const categoriesQueryEnabled = !isSpecialModule && showCategories

  const itemsQuery = useModuleItems(activeModule, searchQuery, selectedCategory, itemsQueryEnabled)
  const categoriesQuery = useModuleCategories(activeModule, categoriesQueryEnabled)

  const items = itemsQuery.data?.pages.flat() ?? []
  const categories = categoriesQuery.data ?? []
  const loading = showCategories ? categoriesQuery.isLoading : itemsQuery.isLoading
  const loadingMore = itemsQuery.isFetchingNextPage
  const hasMore = itemsQuery.hasNextPage ?? false
  const fetchNextPage = itemsQuery.fetchNextPage

  // Função para carregar arquivo_json de um workflow específico
  const loadWorkflowData = useCallback(async (workflowId: string) => {
    try {
      const { data, error } = await supabase
        .from('n8n_workflows')
        .select('arquivo_json')
        .eq('id', workflowId)
        .single()

      if (error) throw error
      
      return data?.arquivo_json
    } catch (error) {
      console.error('Erro ao carregar workflow:', error)
      return null
    }
  }, [supabase])

  // Reset categoria ao mudar módulo
  useEffect(() => {
    setSelectedCategory(null)
  }, [activeModule])

  // Detectar scroll para carregar mais
  useEffect(() => {
    const main = mainRef.current
    if (!main || showCategories || isSpecialModule) return

    const handleScroll = () => {
      if (loadingMore || !hasMore) return

      const { scrollTop, scrollHeight, clientHeight } = main
      
      // Carregar mais quando estiver a 200px do final
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        fetchNextPage()
      }
    }

    main.addEventListener('scroll', handleScroll)
    return () => main.removeEventListener('scroll', handleScroll)
  }, [loadingMore, hasMore, fetchNextPage, showCategories, isSpecialModule])

  const currentModule = modules.find(m => m.id === activeModule)
  const totalCount = selectedCategory 
    ? categoryCount 
    : counts[activeModule] || 0

  // Handler para selecionar categoria
  const handleCategorySelect = (category: string) => {
    const cat = categories.find(c => c.name === category)
    setCategoryCount(cat?.count || 0)
    setSelectedCategory(category)
  }

  // Handler para voltar às categorias
  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  // Tipo de categoria para o grid
  const categoryType = activeModule === 'prompts-chatgpt' ? 'chatgpt' 
    : activeModule === 'prompts-midjourney' ? 'midjourney' 
    : 'typebot'

  // Verificar se módulo usa iframe externo
  const iframeConfig = IFRAME_MODULES[activeModule]
  const isIframeModule = !!iframeConfig

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header onMenuClick={() => setIsMobileMenuOpen(true)} />

      {isStarter && (
        <UpgradeBanner
          moduleName={isModuleLocked ? currentModuleConfig?.name : undefined}
          templateCount={items.length}
          limit={activeModule === 'n8n-templates' ? STARTER_N8N_TEMPLATES_LIMIT : undefined}
        />
      )}
      
      {/* Mobile Drawer */}
      <MobileDrawer 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
      >
        <Sidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          counts={counts}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </MobileDrawer>
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - oculta em mobile, visível em desktop */}
        <Sidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          counts={counts}
          className="hidden lg:flex"
        />
        
        <main ref={mainRef} className="flex-1 overflow-y-auto">
          {/* Módulo bloqueado por tempo (7 dias de garantia) */}
          {isModuleTimeLocked ? (
            <TimeLockedModule 
              moduleName={currentModuleConfig?.name || 'Módulo'} 
              daysRemaining={daysUntilFullAccess} 
            />
          ) : isIframeModule ? (
            /* Renderizar iframe externo */
            <div className="h-full">
              <ExternalDirectory
                url={iframeConfig.url}
                title={iframeConfig.title}
                description={iframeConfig.description}
                isLocked={isModuleLocked}
              />
            </div>
          ) : activeModule === 'self-hosted' ? (
            <SelfHostedDirectory isLocked={isModuleLocked} />
          ) : activeModule === 'ferramentas-gratis' ? (
            <FreeToolsDirectory isLocked={isModuleLocked} />
          ) : (
          <div className="p-6">
            {/* Header do módulo */}
            <div className="mb-6">
              {selectedCategory && (
                <button
                  onClick={handleBackToCategories}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para categorias
                </button>
              )}
              
              {currentModule && (
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{currentModule.icon}</span>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      {currentModule.name}
                    </h1>
                    <p className="text-zinc-400">
                      {selectedCategory 
                        ? `Prompts de ${selectedCategory}`
                        : currentModule.description
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Barra de busca */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              placeholder={showCategories 
                ? "Buscar por nome, descrição ou categoria..." 
                : "Buscar por nome, descrição ou ferramentas..."
              }
            />

            {/* Contador de itens */}
            {!showCategories && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-500">
                  Mostrando <span className="text-white font-medium">{items.length}</span> de{' '}
                  <span className="text-white font-medium">{totalCount.toLocaleString()}</span> itens
                </p>
                {loadingMore && (
                  <p className="text-sm text-purple-400">Carregando mais...</p>
                )}
              </div>
            )}

            {showCategories && categories.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-zinc-500">
                  <span className="text-white font-medium">{categories.length}</span> categorias disponíveis
                </p>
              </div>
            )}

            {/* Grid de categorias ou conteúdo */}
            {showCategories ? (
              <CategoryGrid
                categories={categories}
                onCategorySelect={handleCategorySelect}
                type={categoryType}
                isLocked={isModuleLocked}
              />
            ) : (
              <ContentGrid
                items={items}
                viewMode={viewMode}
                loading={loading}
                onBonusClick={(bonus) => setSelectedBonus(bonus)}
                onWorkflowClick={async (item) => {
                  const jsonData = await loadWorkflowData(item.id)
                  return { ...item, downloadData: jsonData }
                }}
                isLocked={isModuleLocked}
getItemLocked={activeModule === 'n8n-templates' && isStarter
                  ? (_, index) => index >= STARTER_N8N_TEMPLATES_LIMIT
                  : undefined
                }
              />
            )}

            {/* Loading skeleton para categorias */}
            {loading && showCategories && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-32 bg-zinc-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {/* Botão para carregar mais */}
            {!loading && !showCategories && hasMore && items.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
                >
                  {loadingMore ? 'Carregando...' : 'Carregar mais'}
                </button>
              </div>
            )}

            {/* Fim da lista */}
            {!hasMore && items.length > 0 && !showCategories && (
              <p className="text-center text-zinc-500 mt-8 pb-8">
                Você viu todos os {totalCount.toLocaleString()} itens
              </p>
            )}
          </div>
          )}
        </main>
      </div>

      {/* Modal de Bônus */}
      <BonusModal
        isOpen={selectedBonus !== null}
        onClose={() => setSelectedBonus(null)}
        bonus={selectedBonus}
      />
    </div>
  )
}
