'use client'

import { useState } from 'react'
import { 
  Image, Video, Bot, Sparkles, Code, Headphones, 
  BarChart3, Users, Briefcase, Lightbulb, Palette, 
  FileCode, Megaphone, Shield, ShoppingCart, Music,
  GraduationCap, Heart, Wallet, Gamepad2, Mail, Globe,
  Layers, ChevronRight, Check, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Dados das categorias de ferramentas IA
const toolCategories = [
  {
    id: 'images',
    name: 'Images',
    icon: Image,
    count: 128,
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400',
    tools: [
      { name: 'Midjourney', logo: '🎨', color: 'bg-white' },
      { name: 'DALL-E', logo: '🖼️', color: 'bg-black' },
      { name: 'Stable Diffusion', logo: '🌀', color: 'bg-purple-600' },
      { name: 'Leonardo AI', logo: '🦁', color: 'bg-orange-500' },
      { name: 'Canva AI', logo: '📐', color: 'bg-cyan-500' },
      { name: 'Adobe Firefly', logo: '🔥', color: 'bg-red-500' },
      { name: 'Runway', logo: '🛫', color: 'bg-indigo-500' },
      { name: 'PhotoRoom', logo: '📸', color: 'bg-pink-500' },
      { name: 'Remove.bg', logo: '✂️', color: 'bg-blue-500' },
      { name: 'Upscale', logo: '🔍', color: 'bg-yellow-500' },
    ]
  },
  {
    id: 'video',
    name: 'AI Video Agents',
    icon: Video,
    count: 121,
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    tools: [
      { name: 'Synthesia', logo: '🎬', color: 'bg-blue-600' },
      { name: 'HeyGen', logo: '👋', color: 'bg-purple-500' },
      { name: 'Runway Gen-2', logo: '🎥', color: 'bg-indigo-500' },
      { name: 'Pika Labs', logo: '⚡', color: 'bg-yellow-500' },
      { name: 'CapCut', logo: '✂️', color: 'bg-black' },
      { name: 'Descript', logo: '📝', color: 'bg-green-500' },
      { name: 'Lumen5', logo: '💡', color: 'bg-blue-400' },
      { name: 'InVideo', logo: '📹', color: 'bg-red-500' },
      { name: 'Pictory', logo: '🎞️', color: 'bg-orange-500' },
      { name: 'Fliki', logo: '🎙️', color: 'bg-pink-500' },
    ]
  },
  {
    id: 'frameworks',
    name: 'AI Agents Frameworks',
    icon: Layers,
    count: 118,
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-400',
    tools: [
      { name: 'n8n', logo: '🔗', color: 'bg-orange-500' },
      { name: 'LangChain', logo: '🦜', color: 'bg-green-500' },
      { name: 'AutoGPT', logo: '🤖', color: 'bg-black' },
      { name: 'CrewAI', logo: '👥', color: 'bg-purple-500' },
      { name: 'Flowise', logo: '🌊', color: 'bg-blue-500' },
      { name: 'AgentGPT', logo: '🕵️', color: 'bg-indigo-500' },
      { name: 'BabyAGI', logo: '👶', color: 'bg-pink-500' },
      { name: 'AutoGen', logo: '⚙️', color: 'bg-gray-600' },
      { name: 'Semantic Kernel', logo: '🧠', color: 'bg-cyan-500' },
      { name: 'Bee Agent', logo: '🐝', color: 'bg-yellow-500' },
    ]
  },
  {
    id: 'content',
    name: 'Content Creation',
    icon: Sparkles,
    count: 84,
    color: 'from-yellow-500/20 to-orange-500/20',
    iconColor: 'text-yellow-400',
    tools: [
      { name: 'ChatGPT', logo: '💬', color: 'bg-teal-500' },
      { name: 'Claude', logo: '🧠', color: 'bg-orange-400' },
      { name: 'Jasper', logo: '✍️', color: 'bg-blue-500' },
      { name: 'Copy.ai', logo: '📋', color: 'bg-purple-500' },
      { name: 'Writesonic', logo: '🚀', color: 'bg-indigo-500' },
      { name: 'Rytr', logo: '📝', color: 'bg-green-500' },
      { name: 'Notion AI', logo: '📓', color: 'bg-black' },
      { name: 'Grammarly', logo: '✅', color: 'bg-green-600' },
      { name: 'QuillBot', logo: '🪶', color: 'bg-teal-600' },
      { name: 'Wordtune', logo: '🎵', color: 'bg-purple-600' },
    ]
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    icon: Headphones,
    count: 79,
    color: 'from-teal-500/20 to-green-500/20',
    iconColor: 'text-teal-400',
    tools: [
      { name: 'Intercom', logo: '💬', color: 'bg-blue-500' },
      { name: 'Zendesk AI', logo: '🎫', color: 'bg-green-500' },
      { name: 'Tidio', logo: '🤖', color: 'bg-blue-400' },
      { name: 'Drift', logo: '🌊', color: 'bg-blue-600' },
      { name: 'Freshdesk', logo: '🆕', color: 'bg-green-600' },
      { name: 'HubSpot', logo: '🧡', color: 'bg-orange-500' },
      { name: 'Salesforce', logo: '☁️', color: 'bg-blue-500' },
      { name: 'Crisp', logo: '💎', color: 'bg-purple-500' },
      { name: 'LiveChat', logo: '💬', color: 'bg-orange-500' },
      { name: 'Tawk.to', logo: '👁️', color: 'bg-green-500' },
    ]
  },
  {
    id: 'personal-assistant',
    name: 'Personal Assistant',
    icon: Bot,
    count: 70,
    color: 'from-indigo-500/20 to-purple-500/20',
    iconColor: 'text-indigo-400',
    tools: [
      { name: 'ChatGPT', logo: '💬', color: 'bg-teal-500' },
      { name: 'Google Gemini', logo: '💎', color: 'bg-blue-500' },
      { name: 'Claude', logo: '🧠', color: 'bg-orange-400' },
      { name: 'Perplexity', logo: '🔮', color: 'bg-indigo-500' },
      { name: 'Pi', logo: '🥧', color: 'bg-amber-500' },
      { name: 'Poe', logo: '📚', color: 'bg-purple-500' },
      { name: 'Character.AI', logo: '🎭', color: 'bg-blue-400' },
      { name: 'Replika', logo: '👤', color: 'bg-pink-500' },
      { name: 'Bing Chat', logo: '🔍', color: 'bg-blue-600' },
      { name: 'YouChat', logo: '👋', color: 'bg-purple-600' },
    ]
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    icon: BarChart3,
    count: 61,
    color: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400',
    tools: [
      { name: 'Tableau', logo: '📊', color: 'bg-blue-500' },
      { name: 'Power BI', logo: '📈', color: 'bg-yellow-500' },
      { name: 'Amplitude', logo: '📉', color: 'bg-purple-500' },
      { name: 'Mixpanel', logo: '🔀', color: 'bg-purple-600' },
      { name: 'Hex', logo: '⬡', color: 'bg-pink-500' },
      { name: 'Mode', logo: '📐', color: 'bg-green-500' },
      { name: 'Metabase', logo: '🗃️', color: 'bg-blue-400' },
      { name: 'Looker', logo: '👀', color: 'bg-blue-600' },
      { name: 'Grafana', logo: '📊', color: 'bg-orange-500' },
      { name: 'Databricks', logo: '🧱', color: 'bg-red-500' },
    ]
  },
  {
    id: 'ai-avatar',
    name: 'AI Avatar',
    icon: Users,
    count: 54,
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-pink-400',
    tools: [
      { name: 'HeyGen', logo: '👋', color: 'bg-purple-500' },
      { name: 'Synthesia', logo: '🎬', color: 'bg-blue-600' },
      { name: 'D-ID', logo: '🆔', color: 'bg-orange-500' },
      { name: 'Colossyan', logo: '🏛️', color: 'bg-blue-500' },
      { name: 'Hour One', logo: '🕐', color: 'bg-purple-600' },
      { name: 'Elai', logo: '🤖', color: 'bg-indigo-500' },
      { name: 'Rephrase.ai', logo: '🔄', color: 'bg-green-500' },
      { name: 'DeepBrain', logo: '🧠', color: 'bg-cyan-500' },
      { name: 'Vidnoz', logo: '📹', color: 'bg-pink-500' },
      { name: 'Tavus', logo: '📺', color: 'bg-blue-400' },
    ]
  },
  {
    id: 'digital-workers',
    name: 'Digital Workers',
    icon: Briefcase,
    count: 54,
    color: 'from-slate-500/20 to-gray-500/20',
    iconColor: 'text-slate-400',
    tools: [
      { name: 'UiPath', logo: '🤖', color: 'bg-orange-500' },
      { name: 'Automation Anywhere', logo: '⚡', color: 'bg-orange-600' },
      { name: 'Blue Prism', logo: '🔵', color: 'bg-blue-500' },
      { name: 'WorkFusion', logo: '⚙️', color: 'bg-purple-500' },
      { name: 'Kofax', logo: '📄', color: 'bg-green-500' },
      { name: 'ABBYY', logo: '📑', color: 'bg-red-500' },
      { name: 'Celonis', logo: '🔬', color: 'bg-teal-500' },
      { name: 'Hyperscience', logo: '🚀', color: 'bg-blue-400' },
      { name: 'Rossum', logo: '🌹', color: 'bg-pink-500' },
      { name: 'Nanonets', logo: '🔍', color: 'bg-indigo-500' },
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: Megaphone,
    count: 45,
    color: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-400',
    tools: [
      { name: 'HubSpot', logo: '🧡', color: 'bg-orange-500' },
      { name: 'Mailchimp', logo: '🐵', color: 'bg-yellow-400' },
      { name: 'Semrush', logo: '📊', color: 'bg-orange-600' },
      { name: 'Ahrefs', logo: '🔗', color: 'bg-blue-500' },
      { name: 'Hootsuite', logo: '🦉', color: 'bg-black' },
      { name: 'Buffer', logo: '📱', color: 'bg-blue-400' },
      { name: 'Sprout Social', logo: '🌱', color: 'bg-green-500' },
      { name: 'Later', logo: '📅', color: 'bg-pink-500' },
      { name: 'Canva', logo: '🎨', color: 'bg-cyan-500' },
      { name: 'Loomly', logo: '🔄', color: 'bg-purple-500' },
    ]
  },
  {
    id: 'coding',
    name: 'Coding Agent',
    icon: Code,
    count: 42,
    color: 'from-emerald-500/20 to-green-500/20',
    iconColor: 'text-emerald-400',
    tools: [
      { name: 'GitHub Copilot', logo: '🐙', color: 'bg-black' },
      { name: 'Cursor', logo: '▶️', color: 'bg-blue-500' },
      { name: 'Tabnine', logo: '⌨️', color: 'bg-purple-500' },
      { name: 'Codeium', logo: '💎', color: 'bg-teal-500' },
      { name: 'Replit AI', logo: '🔄', color: 'bg-orange-500' },
      { name: 'Amazon CodeWhisperer', logo: '🐱', color: 'bg-orange-400' },
      { name: 'Sourcegraph Cody', logo: '🔍', color: 'bg-purple-600' },
      { name: 'Devin', logo: '🤖', color: 'bg-blue-600' },
      { name: 'v0.dev', logo: '🎨', color: 'bg-black' },
      { name: 'bolt.new', logo: '⚡', color: 'bg-yellow-500' },
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: Lightbulb,
    count: 139,
    color: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400',
    tools: [
      { name: 'Notion AI', logo: '📓', color: 'bg-black' },
      { name: 'Obsidian', logo: '💎', color: 'bg-purple-600' },
      { name: 'Roam Research', logo: '🔮', color: 'bg-blue-500' },
      { name: 'Mem', logo: '🧠', color: 'bg-purple-500' },
      { name: 'Taskade', logo: '✅', color: 'bg-purple-400' },
      { name: 'ClickUp', logo: '🎯', color: 'bg-purple-500' },
      { name: 'Monday.com', logo: '📅', color: 'bg-red-500' },
      { name: 'Asana', logo: '🔶', color: 'bg-orange-500' },
      { name: 'Linear', logo: '📐', color: 'bg-purple-600' },
      { name: 'Coda', logo: '📝', color: 'bg-orange-400' },
    ]
  },
]

export function ToolsDirectory() {
  const [filter, setFilter] = useState<'all' | 'free' | 'opensource' | 'featured'>('all')
  const [showNames, setShowNames] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const totalAgents = toolCategories.reduce((acc, cat) => acc + cat.count, 0)
  
  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="text-center py-8 px-4 border-b border-zinc-800">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          AI Agents Market Landscape
        </h1>
        <p className="text-zinc-400 mb-4">
          Interactive ecosystem map of AI agents, tools, and assistants
        </p>
        
        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-zinc-300">January 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-zinc-300">Categories: {toolCategories.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-zinc-300">Agents: {totalAgents.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-center gap-4 py-4 px-4 border-b border-zinc-800 flex-wrap">
        <button
          onClick={() => setFilter('free')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
            filter === 'free' 
              ? "bg-green-500/20 text-green-400 border border-green-500/50" 
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          )}
        >
          <div className="w-4 h-4 rounded border-2 border-green-500 flex items-center justify-center">
            {filter === 'free' && <Check className="w-3 h-3 text-green-500" />}
          </div>
          Free
        </button>
        
        <button
          onClick={() => setFilter('opensource')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
            filter === 'opensource' 
              ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" 
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          )}
        >
          <div className="w-4 h-4 rounded border-2 border-blue-500 flex items-center justify-center">
            {filter === 'opensource' && <Check className="w-3 h-3 text-blue-500" />}
          </div>
          Open Source
        </button>
        
        <button
          onClick={() => setFilter('featured')}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
            filter === 'featured' 
              ? "bg-purple-500/20 text-purple-400 border border-purple-500/50" 
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          )}
        >
          <div className="w-4 h-4 rounded border-2 border-purple-500 flex items-center justify-center">
            {filter === 'featured' && <Check className="w-3 h-3 text-purple-500" />}
          </div>
          Featured
        </button>

        <div className="w-px h-6 bg-zinc-700" />

        <button
          onClick={() => setShowNames(!showNames)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
            showNames 
              ? "bg-zinc-700 text-white" 
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          )}
        >
          <div className={cn(
            "w-8 h-4 rounded-full transition-colors relative",
            showNames ? "bg-purple-500" : "bg-zinc-600"
          )}>
            <div className={cn(
              "absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform",
              showNames ? "translate-x-4" : "translate-x-0.5"
            )} />
          </div>
          Show Names
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {toolCategories.map((category) => {
          const Icon = category.icon
          const isExpanded = expandedCategories.has(category.id)
          const displayTools = isExpanded ? category.tools : category.tools.slice(0, 10)
          
          return (
            <div
              key={category.id}
              className="bg-zinc-800/50 rounded-xl border border-zinc-700/50 overflow-hidden hover:border-zinc-600/50 transition-colors"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between p-3 border-b border-zinc-700/50">
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", category.iconColor)} />
                  <span className="font-medium text-white text-sm">{category.name}</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-500 text-xs">
                  <span>10/{category.count}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Tools Grid */}
              <div className="p-3">
                <div className="grid grid-cols-5 gap-2">
                  {displayTools.map((tool, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "relative group cursor-pointer",
                        "aspect-square rounded-lg flex items-center justify-center",
                        tool.color,
                        "hover:scale-110 transition-transform",
                        "shadow-md"
                      )}
                      title={tool.name}
                    >
                      <span className="text-lg">{tool.logo}</span>
                      
                      {/* Tooltip with name */}
                      {showNames && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          {tool.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Load More */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-colors border-t border-zinc-700/50 flex items-center justify-center gap-1"
              >
                {isExpanded ? 'Show Less' : 'Load More Agents'}
                <ChevronRight className={cn(
                  "w-3 h-3 transition-transform",
                  isExpanded && "rotate-90"
                )} />
              </button>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="text-center py-4 px-4 border-t border-zinc-800">
        <p className="text-xs text-zinc-500">
          Explore o diretório completo de +14 mil ferramentas de IA •{' '}
          <a 
            href="https://aiagentsdirectory.com/landscape"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
          >
            Ver fonte original
            <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>
    </div>
  )
}
