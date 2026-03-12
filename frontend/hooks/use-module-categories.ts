import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase-browser'
import { modules } from '@/lib/modules'

export type Category = { name: string; count: number }

export function useModuleCategories(activeModule: string, enabled: boolean) {
  return useQuery({
    queryKey: ['module-categories', activeModule],
    queryFn: async () => {
      const supabase = createClient()
      const module = modules.find(m => m.id === activeModule)
      if (!module) return []

      const { data, error } = await supabase
        .from(module.table)
        .select('categoria_prompt')

      if (error) throw error

      const categoryMap = new Map<string, number>()
      data?.forEach(item => {
        const cat = item.categoria_prompt || 'Outros'
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
      })

      return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
    },
    staleTime: 5 * 60 * 1000,
    enabled
  })
}
