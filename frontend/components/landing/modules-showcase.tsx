'use client'

import { 
  Workflow, 
  Rocket, 
  MessageSquare, 
  Image, 
  Bot, 
  Wrench, 
  Server, 
  ShoppingBag, 
  Gift 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const modules = [
  { 
    icon: Workflow, 
    number: '+2500', 
    name: 'Templates n8n', 
    desc: 'Fluxos de automação prontos',
    color: 'from-blue-500 to-cyan-500',
    free: true
  },
  { 
    icon: Rocket, 
    number: '+500', 
    name: 'Chatbots Prontos', 
    desc: 'Agentes de IA avançados',
    examples: 'Atendimento WhatsApp restaurante, Qualificação de leads, Agendamento automático',
    color: 'from-orange-500 to-red-500'
  },
  { 
    icon: MessageSquare, 
    number: '+2400', 
    name: 'Prompts ChatGPT', 
    desc: 'Prompts profissionais testados',
    examples: 'Posts LinkedIn, Propostas comerciais, Roteiros de vídeo',
    color: 'from-emerald-500 to-green-500'
  },
  { 
    icon: Image, 
    number: '+3500', 
    name: 'Prompts Midjourney', 
    desc: 'Prompts para imagens incríveis',
    examples: 'Logos profissionais, Posts Instagram, Mockups de produto',
    color: 'from-purple-500 to-pink-500'
  },
  { 
    icon: Bot, 
    number: '+3000', 
    name: 'Templates Typebot', 
    desc: 'Chatbots conversacionais',
    examples: 'Pesquisa de satisfação, Onboarding de cliente, Quiz interativo',
    color: 'from-violet-500 to-purple-500'
  },
  { 
    icon: Wrench, 
    number: '+14 mil', 
    name: 'Ferramentas IA', 
    desc: 'Diretório completo de IA',
    examples: 'Editores de vídeo, Geradores de imagem, Assistentes de código',
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    icon: Server, 
    number: '+350', 
    name: 'Self-Hosted', 
    desc: 'Softwares para seu servidor',
    examples: 'CRM, Sistema de agendamento, Plataforma de cursos',
    color: 'from-rose-500 to-red-500'
  },
  { 
    icon: ShoppingBag, 
    number: '+30', 
    name: 'SaaS White Label', 
    desc: 'Prontos para revender',
    examples: 'Agendamento, CRM, Automação de marketing',
    color: 'from-orange-500 to-amber-500'
  },
  { 
    icon: Gift, 
    number: '+8', 
    name: 'Bônus Exclusivos', 
    desc: 'Conteúdo extra especial',
    color: 'from-yellow-500 to-orange-500'
  },
]

export function ModulesShowcase() {
  return (
    <section id="recursos" className="py-20 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Mais de <span className="text-white font-semibold">6.000 recursos</span> para automatizar, criar e escalar seu negócio com IA
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <div
                key={index}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1",
                  "bg-zinc-800/50 backdrop-blur-sm border-zinc-700 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/50"
                )}
              >
                {/* Badge Free/Premium */}
                {module.free ? (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg">
                    GRÁTIS
                  </div>
                ) : (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-zinc-700/90 backdrop-blur-sm text-zinc-300 text-xs font-bold rounded-full border border-zinc-600">
                    PREMIUM
                  </div>
                )}
                
                {/* Icon */}
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110",
                  module.color
                )}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <div className="space-y-1 mb-2">
                  <p className="text-2xl font-bold text-white">{module.number}</p>
                  <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">{module.desc}</p>
                {module.examples && (
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    Ex: {module.examples}
                  </p>
                )}

                {/* Hover glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl bg-gradient-to-br",
                  module.color
                )} style={{ transform: 'scale(0.95)' }} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
