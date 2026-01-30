import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-browser'

export function useModuleCounts() {
  return useQuery({
    queryKey: ['module-counts'],
    queryFn: async () => {
      const supabase = createClient()
      
      const tables = [
        { module: 'n8n-templates', table: 'n8n_workflows' },
        { module: 'prompts-chatgpt', table: 'prompts_chatgpt' },
        { module: 'prompts-midjourney', table: 'prompts_midjourney' },
        { module: 'typebot-templates', table: 'typebot_templates' },
        { module: 'saas', table: 'saas' },
        { module: 'bonus', table: 'bonus' },
        { module: 'ferramentas-ia', table: 'ferramentas' },
      ]

      // Executar todas as queries em paralelo
      const results = await Promise.all(
        tables.map(({ table }) => 
          supabase.from(table).select('*', { count: 'exact', head: true })
        )
      )

      const newCounts: Record<string, number> = {}
      tables.forEach(({ module }, index) => {
        newCounts[module] = results[index].count || 0
      })

      // Módulos derivados
      newCounts['super-fluxos'] = 58
      newCounts['self-hosted'] = 350
      newCounts['ferramentas-gratis'] = newCounts['ferramentas-ia']

      return newCounts
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (contagens mudam pouco)
    gcTime: 30 * 60 * 1000, // 30 minutos
  })
}
