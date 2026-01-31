'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { SearchBar } from '@/components/search-bar'
import { ContentGrid } from '@/components/content-grid'
import { CategoryGrid, Category } from '@/components/category-grid'
import { ExternalDirectory } from '@/components/external-directory'
import { SelfHostedDirectory } from '@/components/selfhosted-directory'
import { FreeToolsDirectory } from '@/components/free-tools-directory'
import { BonusModal } from '@/components/bonus-modal'
import { TimeLockedModule } from '@/components/time-locked-module'
import { MobileDrawer } from '@/components/mobile-drawer'
import { modules } from '@/lib/modules'
import { createClient } from '@/lib/supabase-browser'
import { useAuth } from '@/contexts/auth-context'
import { useModuleCounts } from '@/hooks/use-module-counts'

// Módulos gratuitos (disponíveis para todos)
const FREE_MODULES = ['n8n-templates']

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

const PAGE_SIZE = 50

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
}

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
  const [items, setItems] = useState<ContentItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [selectedBonus, setSelectedBonus] = useState<BonusData | null>(null)
  const [selectedWorkflow, setSelectedWorkflow] = useState<ContentItem | null>(null)
  const [workflowData, setWorkflowData] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  
  const { isPremium, hasFullAccess, daysUntilFullAccess } = useAuth()
  const supabase = createClient()
  
  // Usar React Query para contagens (com cache)
  const { data: counts = {} } = useModuleCounts()

  // Módulos especiais que não usam dados do Supabase
  const isSpecialModule = ['ferramentas-ia', 'self-hosted', 'ferramentas-gratis'].includes(activeModule)
  
  // Buscar config do módulo atual
  const currentModuleConfig = modules.find(m => m.id === activeModule)
  
  // Verificar se módulo atual está bloqueado para usuários free
  const isModuleLocked = !FREE_MODULES.includes(activeModule) && !isPremium
  
  // Verificar se módulo requer acesso total (7 dias de premium)
  const requiresFullAccess = currentModuleConfig?.requiresFullAccess || false
  const isModuleTimeLocked = requiresFullAccess && isPremium && !hasFullAccess

  // Verificar se módulo atual usa categorias
  const usesCategoryView = CATEGORY_MODULES.includes(activeModule) && !searchQuery && !isSpecialModule
  const showCategories = usesCategoryView && !selectedCategory

  // Contagens agora são gerenciadas pelo React Query (hook useModuleCounts)

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

  // Reset quando muda módulo
  useEffect(() => {
    setItems([])
    setCategories([])
    setPage(0)
    setHasMore(true)
    setSelectedCategory(null)
  }, [activeModule])

  // Reset quando muda busca
  useEffect(() => {
    setItems([])
    setPage(0)
    setHasMore(true)
  }, [searchQuery, selectedCategory])

  // Carregar categorias para módulos de prompts (otimizado)
  const loadCategories = useCallback(async () => {
    const module = modules.find(m => m.id === activeModule)
    if (!module) return

    setLoading(true)
    
    try {
      // Buscar categorias distintas com contagem usando RPC ou query otimizada
      // Primeiro, buscar apenas categorias únicas (muito mais rápido)
      const { data, error } = await supabase
        .from(module.table)
        .select('categoria_prompt')
      
      if (error) throw error

      // Agrupar por categoria e contar no cliente
      const categoryMap = new Map<string, number>()
      data?.forEach(item => {
        const cat = item.categoria_prompt || 'Outros'
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
      })

      // Converter para array e ordenar
      const cats: Category[] = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)

      setCategories(cats)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }

    setLoading(false)
  }, [activeModule])

  // Função para mapear dados
  const mapData = useCallback((table: string, records: any[]): ContentItem[] => {
    switch (table) {
      case 'n8n_workflows':
        return records.map(w => {
          // Gerar descrição automática se estiver vazia
          let description = w.descricao
          if (!description || description.trim() === '') {
            description = `Workflow completo e pronto para usar: ${w.nome}. Importar no seu n8n.`
          }
          
          return {
            id: w.id,
            title: w.nome,
            description: description,
            tags: w.tags || [],
            type: 'workflow' as const,
            downloadData: w.arquivo_json
          }
        })
      case 'prompts_chatgpt':
        return records.map(p => {
          // Criar título a partir do prompt (primeiras palavras)
          const prompt = p.prompt_br || ''
          const words = prompt.split(' ')
          const title = words.slice(0, 8).join(' ') + (words.length > 8 ? '...' : '')
          
          return {
            id: p.id,
            title: title || p.categoria_prompt || 'Prompt',
            description: prompt,
            type: 'prompt' as const,
            copyContent: prompt,
            tags: [p.categoria_prompt].filter(Boolean)
          }
        })
      case 'prompts_midjourney':
        return records.map(p => ({
          id: p.id,
          title: p.nome || p.categoria_prompt || 'Prompt Midjourney',
          description: p.descricao || p.prompt_br?.substring(0, 200) + '...',
          type: 'prompt' as const,
          copyContent: p.prompt_br || p.prompt_en,
          imageUrl: p.imagem_url,
          tags: [p.categoria_prompt, p.tipo].filter(Boolean)
        }))
      case 'typebot_templates':
        return records.map(t => ({
          id: t.id,
          title: t.nome_resumido || t.nome_original || 'Template Typebot',
          originalName: t.nome_original,
          description: t.descricao,
          type: 'template' as const,
          tags: t.tags || [],
          url: t.link_drive
        }))
      case 'saas':
        return records.map(s => ({
          id: s.id,
          title: s.nome,
          description: s.descricao,
          tags: s.tags || [],
          type: 'saas' as const,
          imageUrl: s.imagem_url,
          url: s.link
        }))
      case 'bonus':
        return records.map(b => ({
          id: b.id,
          title: b.nome,
          description: b.descricao?.substring(0, 150) + '...',
          type: 'bonus' as const,
          imageUrl: b.imagem_url,
          bonusData: {
            id: b.id,
            nome: b.nome,
            descricao: b.descricao,
            imagem_url: b.imagem_url,
            link: b.link,
            bonus_items: b.bonus_items
          }
        }))
      case 'ferramentas':
        return records.map(f => ({
          id: f.id,
          title: f.nome,
          description: f.descricao,
          type: 'tool' as const,
          url: f.url
        }))
      default:
        return []
    }
  }, [])

  // Carregar itens do módulo selecionado
  const loadItems = useCallback(async (pageNum: number, append: boolean = false) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }
    
    const module = modules.find(m => m.id === activeModule)
    if (!module) return

    try {
      const from = pageNum * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      // Selecionar apenas campos necessários (NÃO carregar arquivo_json na listagem)
      const columns = {
        'n8n_workflows': 'id,nome,descricao,tags',
        'prompts_chatgpt': 'id,categoria_prompt,prompt_br',
        'prompts_midjourney': 'id,nome,categoria_prompt,descricao,prompt_br,prompt_en,imagem_url,tipo',
        'typebot_templates': 'id,nome_original,nome_resumido,descricao,tags,link_drive',
        'saas': 'id,nome,descricao,tags,imagem_url,link',
        'bonus': 'id,nome,descricao,imagem_url,link,bonus_items(id,titulo,descricao,link,ordem)',
        'ferramentas': 'id,nome,descricao,url'
      }
      
      let query = supabase
        .from(module.table)
        .select(columns[module.table as keyof typeof columns] || '*')
        .range(from, to)
      
      // Filtrar por categoria selecionada
      if (selectedCategory && CATEGORY_MODULES.includes(activeModule)) {
        query = query.eq('categoria_prompt', selectedCategory)
      }

      // Aplicar busca
      if (searchQuery) {
        switch (module.table) {
          case 'n8n_workflows':
            query = query.or(`nome.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`)
            break
          case 'prompts_chatgpt':
            query = query.or(`categoria_prompt.ilike.%${searchQuery}%,prompt_br.ilike.%${searchQuery}%`)
            break
          case 'prompts_midjourney':
            query = query.or(`nome.ilike.%${searchQuery}%,categoria_prompt.ilike.%${searchQuery}%,prompt_br.ilike.%${searchQuery}%`)
            break
          case 'typebot_templates':
          case 'saas':
          case 'bonus':
          case 'ferramentas':
            query = query.or(`nome.ilike.%${searchQuery}%,descricao.ilike.%${searchQuery}%`)
            break
        }
      }

      const { data: records, error } = await query


      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      const newItems = mapData(module.table, records || [])
      
      if (append) {
        setItems(prev => [...prev, ...newItems])
      } else {
        setItems(newItems)
      }

      // Verificar se há mais itens
      setHasMore(newItems.length === PAGE_SIZE)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }

    setLoading(false)
    setLoadingMore(false)
  }, [activeModule, searchQuery, selectedCategory, mapData])

  // Carregar categorias ou itens dependendo do módulo
  useEffect(() => {
    // Não carregar dados para módulos especiais
    if (isSpecialModule) return
    
    if (showCategories) {
      loadCategories()
    } else {
      loadItems(0, false)
    }
  }, [activeModule, searchQuery, selectedCategory, showCategories, loadCategories, loadItems, isSpecialModule])

  // Detectar scroll para carregar mais
  useEffect(() => {
    const main = mainRef.current
    if (!main || showCategories || isSpecialModule) return

    const handleScroll = () => {
      if (loadingMore || !hasMore) return

      const { scrollTop, scrollHeight, clientHeight } = main
      
      // Carregar mais quando estiver a 200px do final
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        const nextPage = page + 1
        setPage(nextPage)
        loadItems(nextPage, true)
      }
    }

    main.addEventListener('scroll', handleScroll)
    return () => main.removeEventListener('scroll', handleScroll)
  }, [page, loadingMore, hasMore, loadItems, showCategories, isSpecialModule])

  const currentModule = modules.find(m => m.id === activeModule)
  const totalCount = selectedCategory 
    ? categoryCount 
    : counts[activeModule] || 0

  // Handler para selecionar categoria
  const handleCategorySelect = (category: string) => {
    // Buscar contagem da categoria selecionada
    const cat = categories.find(c => c.name === category)
    setCategoryCount(cat?.count || 0)
    setSelectedCategory(category)
    setPage(0)
  }

  // Handler para voltar às categorias
  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setItems([])
    setPage(0)
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
                  // Carregar arquivo_json do workflow
                  const jsonData = await loadWorkflowData(item.id)
                  return { ...item, downloadData: jsonData }
                }}
                isLocked={isModuleLocked}
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
                  onClick={() => {
                    const nextPage = page + 1
                    setPage(nextPage)
                    loadItems(nextPage, true)
                  }}
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
