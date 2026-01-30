'use client'

import { Search, Grid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
  placeholder?: string
}

export function SearchBar({ value, onChange, viewMode, onViewModeChange, placeholder }: SearchBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder={placeholder || "Buscar por nome, descrição ou ferramentas..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={cn(
            "p-2 rounded-md transition-colors",
            viewMode === 'grid' 
              ? "bg-zinc-700 text-white" 
              : "text-zinc-500 hover:text-white"
          )}
        >
          <Grid className="w-5 h-5" />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={cn(
            "p-2 rounded-md transition-colors",
            viewMode === 'list' 
              ? "bg-zinc-700 text-white" 
              : "text-zinc-500 hover:text-white"
          )}
        >
          <List className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
