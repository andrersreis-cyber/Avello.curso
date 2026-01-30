'use client'

import { Download, ExternalLink, Copy, Check, Workflow, MessageSquare, Bot, Palette, Rocket, Gift, Wrench, Sparkles, Zap, Brain, Code2, Lightbulb, Lock } from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

type ContentCardProps = {
  title: string
  description?: string
  tags?: string[]
  type: 'workflow' | 'prompt' | 'template' | 'saas' | 'tool' | 'bonus'
  imageUrl?: string
  url?: string
  onDownload?: () => void
  onCopy?: () => void
  onClick?: () => void
  copyContent?: string
  isLocked?: boolean
}

// Visual PREMIUM para Prompts - Design de alto valor
function PromptPremiumPattern({ seed }: { seed: number }) {
  const colorVariants = [
    { primary: 'from-amber-400 via-yellow-500 to-orange-500', accent: '#F59E0B', name: 'gold' },
    { primary: 'from-emerald-400 via-green-500 to-teal-500', accent: '#10B981', name: 'emerald' },
    { primary: 'from-violet-400 via-purple-500 to-fuchsia-500', accent: '#8B5CF6', name: 'amethyst' },
    { primary: 'from-rose-400 via-pink-500 to-red-500', accent: '#F43F5E', name: 'ruby' },
    { primary: 'from-cyan-400 via-blue-500 to-indigo-500', accent: '#06B6D4', name: 'sapphire' },
  ]
  
  const variant = colorVariants[seed % colorVariants.length]
  const rotation = (seed % 360)

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Fundo com gradiente premium */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-30",
        variant.primary
      )} />

      {/* Efeito de luz animada no topo */}
      <div 
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${variant.accent}50 0%, transparent 70%)`,
        }}
      />

      {/* Padrão geométrico premium - ondas */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`premium-grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={variant.accent} stopOpacity="0.1" />
            <stop offset="50%" stopColor={variant.accent} stopOpacity="0.2" />
            <stop offset="100%" stopColor={variant.accent} stopOpacity="0.1" />
          </linearGradient>
          <pattern id={`premium-pattern-${seed}`} x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill={variant.accent} opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#premium-pattern-${seed})`} />
        {/* Curvas elegantes */}
        <path 
          d="M0,80 Q50,40 100,80" 
          stroke={`url(#premium-grad-${seed})`} 
          strokeWidth="0.5" 
          fill="none"
          transform={`rotate(${rotation % 20}, 50, 50)`}
        />
        <path 
          d="M0,60 Q50,20 100,60" 
          stroke={`url(#premium-grad-${seed})`} 
          strokeWidth="0.3" 
          fill="none"
          transform={`rotate(${(rotation + 10) % 20}, 50, 50)`}
        />
      </svg>

      {/* Brilho central tipo "gema" */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Reflexo externo */}
          <div 
            className="absolute w-28 h-28 rounded-full blur-2xl opacity-50"
            style={{ 
              background: `radial-gradient(circle, ${variant.accent}80 0%, transparent 70%)`,
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%'
            }}
          />
          
          {/* Container do ícone com efeito de vidro */}
          <div className="relative">
            {/* Sombra colorida */}
            <div 
              className="absolute inset-0 rounded-2xl blur-xl opacity-60"
              style={{ background: `linear-gradient(135deg, ${variant.accent}, transparent)` }}
            />
            
            {/* Card de vidro */}
            <div className={cn(
              "relative w-20 h-20 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br backdrop-blur-sm border border-white/20",
              variant.primary
            )}>
              {/* Brilho interno superior */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent" />
              
              {/* Ícone de lâmpada premium */}
              <div className="relative">
                <Lightbulb className="w-10 h-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                {/* Raios de luz */}
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300" />
              </div>
            </div>
          </div>
          
          {/* Partículas flutuantes */}
          <div className="absolute -top-3 left-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />
          <div className="absolute top-1/2 -right-4 w-1 h-1 rounded-full bg-white/40" />
          <div className="absolute -bottom-2 left-1/4 w-1 h-1 rounded-full bg-white/50" />
        </div>
      </div>

      {/* Badge "PREMIUM" sutil no canto */}
      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
        <Sparkles className="w-3 h-3 text-yellow-400" />
        <span className="text-[10px] font-medium text-white/70 tracking-wider">PRO</span>
      </div>

      {/* Brilho de borda inferior */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${variant.accent}50, transparent)` }}
      />
    </div>
  )
}

// Visual padrão para outros tipos (Workflow, Template, etc.)
function StandardPattern({ type, seed }: { type: string, seed: number }) {
  const patterns = {
    workflow: {
      primary: 'from-blue-500 to-cyan-400',
      secondary: 'from-blue-600/30 to-transparent',
      icon: Workflow,
      decorIcons: [Zap, Code2, Sparkles]
    },
    template: {
      primary: 'from-purple-500 to-pink-400',
      secondary: 'from-purple-600/30 to-transparent',
      icon: Bot,
      decorIcons: [Code2, Sparkles, Zap]
    },
    saas: {
      primary: 'from-orange-500 to-amber-400',
      secondary: 'from-orange-600/30 to-transparent',
      icon: Rocket,
      decorIcons: [Zap, Sparkles, Code2]
    },
    tool: {
      primary: 'from-cyan-500 to-teal-400',
      secondary: 'from-cyan-600/30 to-transparent',
      icon: Wrench,
      decorIcons: [Zap, Code2, Sparkles]
    },
    bonus: {
      primary: 'from-yellow-500 to-orange-400',
      secondary: 'from-yellow-600/30 to-transparent',
      icon: Gift,
      decorIcons: [Sparkles, Zap, Gift]
    }
  }

  const pattern = patterns[type as keyof typeof patterns] || patterns.workflow
  const MainIcon = pattern.icon
  const DecorIcon1 = pattern.decorIcons[seed % 3]
  const DecorIcon2 = pattern.decorIcons[(seed + 1) % 3]

  const positions = [
    { x: -20 + (seed % 5) * 8, y: -10 + (seed % 3) * 5 },
    { x: 70 + (seed % 4) * 6, y: 60 + (seed % 3) * 8 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-900">
      {/* Gradiente de fundo */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-15",
        pattern.primary
      )} />
      
      {/* Grid sutil */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Círculos blur */}
      <div className={cn(
        "absolute w-28 h-28 rounded-full blur-3xl opacity-30 bg-gradient-to-r",
        pattern.primary
      )} style={{ top: '-20%', right: '-10%' }} />

      {/* Ícones flutuantes */}
      <DecorIcon1 
        className="absolute w-5 h-5 text-white/5" 
        style={{ left: `${positions[0].x}%`, top: `${positions[0].y}%` }}
      />
      <DecorIcon2 
        className="absolute w-4 h-4 text-white/5" 
        style={{ left: `${positions[1].x}%`, top: `${positions[1].y}%` }}
      />

      {/* Ícone central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className={cn(
            "absolute inset-0 scale-125 rounded-full blur-xl opacity-30 bg-gradient-to-r",
            pattern.primary
          )} />
          <div className={cn(
            "relative w-16 h-16 rounded-xl bg-gradient-to-br flex items-center justify-center",
            pattern.primary,
            "opacity-80"
          )}>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent to-white/10" />
            <MainIcon className="w-8 h-8 text-white/90" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente que escolhe o padrão visual baseado no tipo
function CardVisualPattern({ type, seed }: { type: string, seed: number }) {
  // Prompts usam visual premium especial
  if (type === 'prompt') {
    return <PromptPremiumPattern seed={seed} />
  }
  
  // Outros tipos usam padrão standard
  return <StandardPattern type={type} seed={seed} />
}

export function ContentCard({
  title,
  description,
  tags,
  type,
  imageUrl,
  url,
  onDownload,
  onCopy,
  onClick,
  copyContent,
  isLocked = false
}: ContentCardProps) {
  const [copied, setCopied] = useState(false)
  
  // Seed baseado no título para variação visual consistente
  const seed = useMemo(() => {
    let hash = 0
    for (let i = 0; i < title.length; i++) {
      hash = ((hash << 5) - hash) + title.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash)
  }, [title])

  const handleCopy = async () => {
    if (copyContent) {
      await navigator.clipboard.writeText(copyContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      onCopy?.()
    }
  }

  const typeConfig = {
    workflow: { 
      label: 'Workflow', 
      color: 'bg-blue-500/20 text-blue-400',
      gradient: 'from-blue-600/20 to-cyan-600/20',
      icon: Workflow,
      iconColor: 'text-blue-400'
    },
    prompt: { 
      label: 'Prompt', 
      color: 'bg-emerald-500/20 text-emerald-400',
      gradient: 'from-emerald-600/20 to-green-600/20',
      icon: Lightbulb,
      iconColor: 'text-emerald-400'
    },
    template: { 
      label: 'Template', 
      color: 'bg-purple-500/20 text-purple-400',
      gradient: 'from-purple-600/20 to-pink-600/20',
      icon: Bot,
      iconColor: 'text-purple-400'
    },
    saas: { 
      label: 'SaaS', 
      color: 'bg-orange-500/20 text-orange-400',
      gradient: 'from-orange-600/20 to-amber-600/20',
      icon: Rocket,
      iconColor: 'text-orange-400'
    },
    tool: { 
      label: 'Ferramenta', 
      color: 'bg-cyan-500/20 text-cyan-400',
      gradient: 'from-cyan-600/20 to-teal-600/20',
      icon: Wrench,
      iconColor: 'text-cyan-400'
    },
    bonus: { 
      label: 'Bônus', 
      color: 'bg-yellow-500/20 text-yellow-400',
      gradient: 'from-yellow-600/20 to-orange-600/20',
      icon: Gift,
      iconColor: 'text-yellow-400'
    }
  }

  const config = typeConfig[type]

  return (
    <div 
      className={cn(
        "group bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Imagem ou placeholder visual elaborado */}
      <div className="aspect-[16/9] overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform",
              isLocked && "opacity-50"
            )}
          />
        ) : (
          <div className={cn(isLocked && "opacity-50")}>
            <CardVisualPattern type={type} seed={seed} />
          </div>
        )}
        {/* Badge do tipo no canto */}
        <span className={cn(
          "absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-white/10",
          config.color
        )}>
          {config.label}
        </span>
        
        {/* Overlay de bloqueio */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 rounded-full border border-zinc-700">
              <Lock className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-medium text-zinc-300">Premium</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 bg-zinc-700/50 text-zinc-400 rounded">
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs px-2 py-0.5 text-zinc-500">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-zinc-700/50">
          {onDownload && (
            <button 
              onClick={onDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
          
          {copyContent && (
            <button 
              onClick={handleCopy}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors",
                copied 
                  ? "bg-green-600 text-white" 
                  : "bg-zinc-700 hover:bg-zinc-600 text-white"
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
                  Copiar
                </>
              )}
            </button>
          )}
          
          {/* Botão de download para SaaS */}
          {url && type === 'saas' && (
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              Baixar SaaS
            </a>
          )}
          
          {/* Botão de link para outros tipos */}
          {url && type !== 'saas' && (
            <a 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
