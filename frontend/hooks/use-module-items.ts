import { useInfiniteQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-browser'
import { modules } from '@/lib/modules'

const PAGE_SIZE = 50
const CATEGORY_MODULES = ['prompts-chatgpt', 'prompts-midjourney']

export type ContentItem = {
  id: string
  title: string
  description?: string
  tags?: string[]
  type: 'workflow' | 'prompt' | 'template' | 'saas' | 'tool' | 'bonus'
  imageUrl?: string
  url?: string
  copyContent?: string
  downloadData?: object
  bonusData?: {
    id: number
    nome: string
    descricao: string
    imagem_url?: string
    link?: string
    bonus_items?: { id: number; titulo: string; descricao?: string; link?: string; ordem: number }[]
  }
  originalName?: string
}

function mapData(table: string, records: any[]): ContentItem[] {
  switch (table) {
    case 'n8n_workflows':
      return records.map(w => {
        let description = w.descricao
        if (!description || description.trim() === '') {
          description = `Workflow completo e pronto para usar: ${w.nome}. Importar no seu n8n.`
        }
        return {
          id: w.id,
          title: w.nome,
          description,
          tags: w.tags || [],
          type: 'workflow' as const,
          downloadData: w.arquivo_json
        }
      })
    case 'prompts_chatgpt':
      return records.map(p => {
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
}

export function useModuleItems(
  activeModule: string,
  searchQuery: string,
  selectedCategory: string | null,
  enabled: boolean
) {
  return useInfiniteQuery({
    queryKey: ['module-items', activeModule, searchQuery, selectedCategory],
    queryFn: async ({ pageParam }) => {
      const supabase = createClient()
      const module = modules.find(m => m.id === activeModule)
      if (!module) return []

      const from = pageParam * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const columns: Record<string, string> = {
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
        .select(columns[module.table] || '*')
        .range(from, to)

      if (module.table === 'n8n_workflows') {
        query = query.order('id', { ascending: true })
      }

      if (selectedCategory && CATEGORY_MODULES.includes(activeModule)) {
        query = query.eq('categoria_prompt', selectedCategory)
      }

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
      if (error) throw error

      return mapData(module.table, records || [])
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length : undefined,
    staleTime: 5 * 60 * 1000,
    enabled
  })
}
