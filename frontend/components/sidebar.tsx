'use client'

import { modules, Module } from '@/lib/modules'
import { cn } from '@/lib/utils'
import { ChevronRight, Sparkles, TrendingUp, Zap } from 'lucide-react'

type SidebarProps = {
  activeModule: string
  onModuleChange: (moduleId: string) => void
  counts: Record<string, number>
  onClose?: () => void // Para fechar drawer em mobile
  className?: string
}

// Categorias de módulos
const moduleCategories = {
  templates: ['n8n-templates', 'super-fluxos', 'typebot-templates'],
  prompts: ['prompts-chatgpt', 'prompts-midjourney'],
  resources: ['saas', 'bonus', 'ferramentas-ia', 'self-hosted', 'ferramentas-gratis']
}

// Configuração visual por módulo
const moduleStyles: Record<string, { gradient: string, iconBg: string, badge?: string }> = {
  'n8n-templates': { 
    gradient: 'from-blue-600/20 to-cyan-600/20', 
    iconBg: 'from-blue-500 to-cyan-500',
    badge: 'HOT'
  },
  'super-fluxos': { 
    gradient: 'from-orange-600/20 to-red-600/20', 
    iconBg: 'from-orange-500 to-red-500',
    badge: 'TOP'
  },
  'prompts-chatgpt': { 
    gradient: 'from-emerald-600/20 to-green-600/20', 
    iconBg: 'from-emerald-500 to-green-500',
    badge: 'NEW'
  },
  'prompts-midjourney': { 
    gradient: 'from-purple-600/20 to-pink-600/20', 
    iconBg: 'from-purple-500 to-pink-500'
  },
  'typebot-templates': { 
    gradient: 'from-violet-600/20 to-purple-600/20', 
    iconBg: 'from-violet-500 to-purple-500'
  },
  'saas': { 
    gradient: 'from-orange-600/20 to-amber-600/20', 
    iconBg: 'from-orange-500 to-amber-500',
    badge: 'PRO'
  },
  'bonus': { 
    gradient: 'from-yellow-600/20 to-orange-600/20', 
    iconBg: 'from-yellow-500 to-orange-500'
  },
  'ferramentas-ia': { 
    gradient: 'from-cyan-600/20 to-blue-600/20', 
    iconBg: 'from-cyan-500 to-blue-500'
  },
  'self-hosted': { 
    gradient: 'from-rose-600/20 to-red-600/20', 
    iconBg: 'from-rose-500 to-red-500'
  },
  'ferramentas-gratis': { 
    gradient: 'from-green-600/20 to-emerald-600/20', 
    iconBg: 'from-green-500 to-emerald-500'
  }
}

export function Sidebar({ activeModule, onModuleChange, counts, onClose, className }: SidebarProps) {
  const totalItems = Object.values(counts).reduce((a, b) => a + b, 0)

  // Handler que fecha o drawer em mobile após selecionar módulo
  const handleModuleChange = (moduleId: string) => {
    onModuleChange(moduleId)
    // Fecha o drawer em mobile
    if (onClose) onClose()
  }

  return (
    <aside className={cn("w-80 bg-zinc-900 border-r border-zinc-700 overflow-y-auto flex flex-col", className)}>
      {/* Header Stats */}
      <div className="p-4 border-b border-zinc-700">
        <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Total de Recursos</p>
                <p className="text-lg font-bold text-white">{totalItems.toLocaleString()}+</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full border border-green-500/30">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-[10px] text-green-400 font-medium">Atualizado</span>
            </div>
          </div>
          
          {/* Progress bars */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 w-16">Templates</span>
              <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 w-16">Prompts</span>
              <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: '70%' }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-400 w-16">Recursos</span>
              <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {/* Section: Templates */}
        <SectionTitle title="Templates & Fluxos" />
        {modules.filter(m => m.enabled && moduleCategories.templates.includes(m.id)).map((module) => (
          <ModuleButton 
            key={module.id}
            module={module}
            isActive={activeModule === module.id}
            count={counts[module.id]}
            onClick={() => handleModuleChange(module.id)}
            style={moduleStyles[module.id]}
          />
        ))}

        {/* Section: Prompts */}
        <SectionTitle title="Prompts de IA" />
        {modules.filter(m => m.enabled && moduleCategories.prompts.includes(m.id)).map((module) => (
          <ModuleButton 
            key={module.id}
            module={module}
            isActive={activeModule === module.id}
            count={counts[module.id]}
            onClick={() => handleModuleChange(module.id)}
            style={moduleStyles[module.id]}
          />
        ))}

        {/* Section: Resources */}
        <SectionTitle title="Recursos & Ferramentas" />
        {modules.filter(m => m.enabled && moduleCategories.resources.includes(m.id)).map((module) => (
          <ModuleButton 
            key={module.id}
            module={module}
            isActive={activeModule === module.id}
            count={counts[module.id]}
            onClick={() => handleModuleChange(module.id)}
            style={moduleStyles[module.id]}
          />
        ))}
      </nav>

      {/* Footer CTA */}
      <div className="p-4 border-t border-zinc-700">
        <button className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group shadow-lg shadow-cyan-500/20">
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span>Upgrade Premium</span>
        </button>
      </div>
    </aside>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-4 pb-2">
      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{title}</span>
      <div className="flex-1 h-px bg-zinc-700" />
    </div>
  )
}

function ModuleButton({ 
  module, 
  isActive, 
  count, 
  onClick,
  style
}: { 
  module: Module
  isActive: boolean
  count?: number
  onClick: () => void
  style?: { gradient: string, iconBg: string, badge?: string }
}) {
  const defaultStyle = { gradient: 'from-purple-600/20 to-pink-600/20', iconBg: 'from-purple-500 to-pink-500', badge: undefined }
  const { gradient, iconBg, badge } = style || defaultStyle

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden",
        isActive
          ? `bg-gradient-to-r ${gradient} border border-zinc-600`
          : "hover:bg-zinc-800 border border-transparent"
      )}
    >
      <div className="flex items-center gap-3 relative z-10">
        {/* Icon */}
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform group-hover:scale-110",
          isActive 
            ? `bg-gradient-to-br ${iconBg}` 
            : "bg-zinc-800 group-hover:bg-zinc-700"
        )}>
          {module.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-semibold text-sm truncate",
              isActive ? "text-white" : "text-zinc-200 group-hover:text-white"
            )}>
              {module.name}
            </span>
            
            {/* Badge */}
            {badge && (
              <span className={cn(
                "px-1.5 py-0.5 text-[9px] font-bold rounded-full",
                badge === 'HOT' && "bg-red-500/30 text-red-300 border border-red-500/30",
                badge === 'NEW' && "bg-green-500/30 text-green-300 border border-green-500/30",
                badge === 'PRO' && "bg-yellow-500/30 text-yellow-300 border border-yellow-500/30"
              )}>
                {badge}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-0.5">
            <span className={cn(
              "text-[11px] truncate pr-2",
              isActive ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"
            )}>
              {module.description}
            </span>
            {count !== undefined && (
              <span className={cn(
                "text-[11px] font-semibold shrink-0 tabular-nums",
                isActive ? "text-white" : "text-zinc-400"
              )}>
                {count.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className={cn(
          "w-4 h-4 shrink-0 transition-all",
          isActive 
            ? "text-zinc-400" 
            : "text-zinc-600 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-zinc-400"
        )} />
      </div>
    </button>
  )
}
