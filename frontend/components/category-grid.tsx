'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Lightbulb, Palette, FileCode, Sparkles, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UpgradeModal } from './upgrade-modal'

export type Category = {
  name: string
  count: number
  description?: string
}

type CategoryGridProps = {
  categories: Category[]
  onCategorySelect: (category: string) => void
  type: 'chatgpt' | 'midjourney' | 'typebot'
  isLocked?: boolean
}

const typeConfig = {
  chatgpt: {
    icon: Lightbulb,
    color: 'from-yellow-500/20 to-amber-500/20',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    badgeBg: 'bg-zinc-800',
    badgeText: 'text-zinc-300'
  },
  midjourney: {
    icon: Palette,
    color: 'from-pink-500/20 to-purple-500/20',
    borderColor: 'border-pink-500/30',
    iconColor: 'text-pink-400',
    badgeBg: 'bg-zinc-800',
    badgeText: 'text-zinc-300'
  },
  typebot: {
    icon: FileCode,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    badgeBg: 'bg-zinc-800',
    badgeText: 'text-zinc-300'
  }
}

// Configuração visual para categorias Midjourney (estilos artísticos)
const midjourneyArtStyles: Record<string, {
  gradient: string
  pattern: 'surreal' | 'street' | 'renaissance' | 'realistic' | 'psychedelic' | 'impressionist' | 'pop' | 'pointillist' | 'futurist' | 'orthodox' | 'orphism' | 'default'
  accent: string
  description: string
}> = {
  'O melhor Prompt para Midjourney': {
    gradient: 'from-violet-600 via-fuchsia-500 to-pink-500',
    pattern: 'default',
    accent: 'violet',
    description: 'Os melhores prompts selecionados'
  },
  'Surrealismo': {
    gradient: 'from-indigo-600 via-purple-500 to-pink-400',
    pattern: 'surreal',
    accent: 'purple',
    description: 'Arte onírica e imaginativa'
  },
  'Arte de Rua': {
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    pattern: 'street',
    accent: 'orange',
    description: 'Graffiti e arte urbana'
  },
  'Arte Renascença': {
    gradient: 'from-amber-600 via-yellow-500 to-orange-400',
    pattern: 'renaissance',
    accent: 'amber',
    description: 'Clássicos da era dourada'
  },
  'Realismo': {
    gradient: 'from-slate-600 via-gray-500 to-zinc-400',
    pattern: 'realistic',
    accent: 'slate',
    description: 'Representação fiel da realidade'
  },
  'Arte Psicodélica': {
    gradient: 'from-fuchsia-500 via-cyan-400 to-lime-400',
    pattern: 'psychedelic',
    accent: 'fuchsia',
    description: 'Cores vibrantes e padrões fluidos'
  },
  'Pós-impressionismo': {
    gradient: 'from-blue-500 via-teal-400 to-emerald-400',
    pattern: 'impressionist',
    accent: 'teal',
    description: 'Pinceladas expressivas'
  },
  'Arte Pop': {
    gradient: 'from-yellow-400 via-pink-500 to-cyan-400',
    pattern: 'pop',
    accent: 'pink',
    description: 'Cultura popular e cores vivas'
  },
  'Pontilhismo': {
    gradient: 'from-blue-600 via-indigo-500 to-violet-400',
    pattern: 'pointillist',
    accent: 'indigo',
    description: 'Pontos que formam imagens'
  },
  'Panfuturismo': {
    gradient: 'from-cyan-500 via-blue-500 to-purple-500',
    pattern: 'futurist',
    accent: 'cyan',
    description: 'Movimento e velocidade'
  },
  'Ícone ortodoxo': {
    gradient: 'from-amber-500 via-yellow-400 to-orange-300',
    pattern: 'orthodox',
    accent: 'amber',
    description: 'Arte religiosa bizantina'
  },
  'Orfismo': {
    gradient: 'from-rose-500 via-violet-500 to-blue-500',
    pattern: 'orphism',
    accent: 'rose',
    description: 'Círculos e cores abstratas'
  }
}

// Componente de padrão visual para cada estilo artístico
function ArtStylePattern({ pattern, className }: { pattern: string, className?: string }) {
  switch (pattern) {
    case 'surreal':
      // Formas flutuantes e olhos (Salvador Dalí style)
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute top-2 right-4 w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white/40" />
          </div>
          <div className="absolute bottom-4 left-6 w-12 h-6 border-2 border-white/20 rounded-full transform -rotate-12" />
          <div className="absolute top-1/2 left-1/3 w-6 h-6 bg-white/10 rounded-full blur-sm" />
          <svg className="absolute bottom-2 right-2 w-10 h-10 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
            <circle cx="12" cy="12" r="2"/>
          </svg>
        </div>
      )
    
    case 'street':
      // Spray paint drips e formas geométricas
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute top-0 left-4 w-2 h-12 bg-gradient-to-b from-white/30 to-transparent rounded-b-full" />
          <div className="absolute top-2 left-8 w-1.5 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-b-full" />
          <div className="absolute top-3 right-6 w-8 h-8 border-3 border-white/30 transform rotate-12" />
          <div className="absolute bottom-2 left-1/3 text-white/30 font-bold text-2xl transform -rotate-6">★</div>
          <div className="absolute bottom-4 right-4 w-6 h-6 rounded-full border-2 border-dashed border-white/20" />
        </div>
      )
    
    case 'renaissance':
      // Moldura clássica e elementos decorativos
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute inset-2 border border-white/20 rounded-sm" />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-4 border-t border-l border-r border-white/30 rounded-t-full" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-4 border-b border-l border-r border-white/30 rounded-b-full" />
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z"/>
          </svg>
        </div>
      )
    
    case 'realistic':
      // Grade de perspectiva
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
        </div>
      )
    
    case 'psychedelic':
      // Espirais e ondas coloridas
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-white/20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-white/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white/10" />
          <svg className="absolute top-2 right-2 w-6 h-6 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21"/>
            <path d="M12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17"/>
          </svg>
        </div>
      )
    
    case 'impressionist':
      // Pinceladas curtas
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-1 bg-white/20 rounded-full"
              style={{
                top: `${20 + (i % 4) * 20}%`,
                left: `${15 + (i % 3) * 25}%`,
                transform: `rotate(${(i * 30) - 45}deg)`
              }}
            />
          ))}
        </div>
      )
    
    case 'pop':
      // Meio-tom e formas bold
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute top-2 left-2 w-6 h-6 bg-white/30 rounded-full" />
          <div className="absolute top-4 left-6 w-4 h-4 bg-white/20 rounded-full" />
          <div className="absolute bottom-3 right-3 text-white/40 font-black text-xl">POP!</div>
          <div className="absolute top-1/2 right-4 w-3 h-3 bg-white/25" />
          <svg className="absolute bottom-2 left-4 w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
          </svg>
        </div>
      )
    
    case 'pointillist':
      // Pontos em padrão
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white/25 rounded-full"
              style={{
                top: `${10 + (i % 5) * 18}%`,
                left: `${8 + Math.floor(i / 5) * 15}%`
              }}
            />
          ))}
        </div>
      )
    
    case 'futurist':
      // Linhas de movimento
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 bg-gradient-to-r from-white/30 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                left: '10%',
                width: `${40 + i * 10}%`,
                transform: `rotate(${-5 + i * 2}deg)`
              }}
            />
          ))}
          <div className="absolute top-1/2 right-4 w-6 h-6 border-2 border-white/20 transform rotate-45" />
        </div>
      )
    
    case 'orthodox':
      // Auréola e elementos dourados
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-white/30" />
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border border-white/15" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-12 border border-white/20 rounded-t-full" />
          <svg className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L14 10H22L16 15L18 22L12 18L6 22L8 15L2 10H10L12 2Z"/>
          </svg>
        </div>
      )
    
    case 'orphism':
      // Círculos concêntricos coloridos
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white/15" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/30" />
        </div>
      )
    
    default:
      // Padrão com sparkles
      return (
        <div className={cn("absolute inset-0 overflow-hidden", className)}>
          <Sparkles className="absolute top-3 right-3 w-6 h-6 text-white/30" />
          <Sparkles className="absolute bottom-4 left-4 w-4 h-4 text-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/10" />
        </div>
      )
  }
}

// Tradução de categorias
const categoryTranslations: Record<string, string> = {
  'Career': 'Carreira',
  'Business': 'Negócios',
  'Email Marketing': 'E-mail Marketing',
  'Google Sheets': 'Google Planilhas',
  'Act As': 'Atuar Como',
  'Copywriting': 'Copywriting',
  'Microsoft Excel': 'Microsoft Excel',
  'Learn English': 'Aprender Inglês',
  'Shadow Work for Signs': 'Trabalho Interior',
  'Google Ads': 'Google Ads',
  'ETSY': 'ETSY',
  'Bonus': 'Bônus',
  'Marketing': 'Marketing',
  'Social Media': 'Redes Sociais',
  'SEO': 'SEO',
  'Sales': 'Vendas',
  'Productivity': 'Produtividade',
  'Writing': 'Escrita',
  'Education': 'Educação',
  'Health': 'Saúde',
  'Finance': 'Finanças',
  'Technology': 'Tecnologia',
  'Art': 'Arte',
  'Music': 'Música',
  'Photography': 'Fotografia',
  'Video': 'Vídeo',
  'Design': 'Design',
  'Development': 'Desenvolvimento',
  'Data': 'Dados',
  'AI': 'Inteligência Artificial',
  'Automation': 'Automação'
}

function translateCategory(category: string): string {
  return categoryTranslations[category] || category
}

export function CategoryGrid({ categories, onCategorySelect, type, isLocked = false }: CategoryGridProps) {
  const config = typeConfig[type]
  const Icon = config.icon
  const isMidjourney = type === 'midjourney'
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const handleCategoryClick = (categoryName: string) => {
    if (isLocked) {
      setShowUpgradeModal(true)
      return
    }
    onCategorySelect(categoryName)
  }

  return (
    <>
      {/* Banner de conteúdo bloqueado */}
      {isLocked && (
        <div className="mb-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-white font-medium">Conteúdo Premium</p>
              <p className="text-sm text-zinc-400">Visualize as categorias, mas faça upgrade para acessar</p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const artStyle = isMidjourney ? midjourneyArtStyles[category.name] : null
        
        return (
          <button
            key={category.name}
            onClick={() => handleCategoryClick(category.name)}
            className={cn(
              "relative text-left rounded-xl border transition-all overflow-hidden group",
              "border-zinc-700/50 hover:border-purple-500/50",
              "hover:shadow-lg hover:shadow-purple-500/10",
              "bg-zinc-800/50 hover:bg-zinc-800"
            )}
          >
            {/* Visual temático para Midjourney */}
            {isMidjourney && artStyle && (
              <div className={cn(
                "relative h-24 overflow-hidden",
                `bg-gradient-to-br ${artStyle.gradient}`
              )}>
                {/* Padrão artístico */}
                <ArtStylePattern pattern={artStyle.pattern} />
                
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-800/90 via-transparent to-transparent" />
                
                {/* Badge de contagem */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                  <span className="text-xs font-semibold text-white">
                    {category.count} prompts
                  </span>
                </div>
                
                {/* Ícone do estilo */}
                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Conteúdo do card */}
            <div className={cn("p-4", !isMidjourney && "pt-5")}>
              {/* Header para não-Midjourney */}
              {!isMidjourney && (
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    `bg-gradient-to-br ${config.color}`
                  )}>
                    <Icon className={cn("w-5 h-5", config.iconColor)} />
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    config.badgeBg,
                    config.badgeText
                  )}>
                    {category.count} prompts
                  </span>
                </div>
              )}

              {/* Título */}
              <h3 className={cn(
                "font-semibold text-white mb-1",
                isMidjourney ? "text-base" : "text-lg"
              )}>
                {translateCategory(category.name)}
              </h3>

              {/* Descrição */}
              <p className="text-sm text-zinc-400">
                {artStyle?.description || `Coleção de ${category.count} prompts sobre ${translateCategory(category.name)}.`}
              </p>
            </div>
            
            {/* Overlay de bloqueio */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-xl">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 rounded-full border border-zinc-700">
                  <Lock className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-medium text-zinc-300">Premium</span>
                </div>
              </div>
            )}
          </button>
        )
      })}
      </div>
      
      {/* Modal de Upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  )
}
