'use client'

import { Workflow, MessageSquare, ShoppingBag, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const transformationBlocks = [
  {
    title: 'Vender automações para clientes',
    desc: 'Templates n8n, chatbots e Typebot prontos para implementar',
    resources: ['+2500 Templates n8n', '+500 Chatbots', '+3000 Typebot'],
    icon: Workflow,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Prestar serviços com IA',
    desc: 'Prompts e ferramentas para consultoria e criação',
    resources: ['+2400 Prompts ChatGPT', '+3500 Midjourney', '+14 mil Ferramentas IA'],
    icon: MessageSquare,
    color: 'from-emerald-500 to-green-500',
  },
  {
    title: 'Criar renda recorrente',
    desc: 'SaaS white-label e self-hosted para revender',
    resources: ['+30 SaaS White Label', '+350 Self-Hosted', '+8 Bônus'],
    icon: ShoppingBag,
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Economizar tempo e produzir mais',
    desc: 'Prompts prontos e ferramentas específicas',
    resources: ['Prompts para conteúdo', 'Ferramentas de produtividade'],
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
  },
]

export function ModulesShowcase() {
  return (
    <section id="recursos" className="py-20 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Recursos organizados por resultado
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Não é inventário. É atalho para <span className="text-white font-semibold">vender, implementar e escalar</span> com IA.
          </p>
        </div>

        {/* Grid por transformação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transformationBlocks.map((block, index) => {
            const Icon = block.icon
            return (
              <div
                key={index}
                className={cn(
                  'group relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1',
                  'bg-zinc-800/50 backdrop-blur-sm border-zinc-700 hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/50'
                )}
              >
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br shadow-lg transition-transform group-hover:scale-110',
                    block.color
                  )}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{block.title}</h3>
                <p className="text-sm text-zinc-400 mb-4">{block.desc}</p>
                <ul className="space-y-1">
                  {block.resources.map((resource, i) => (
                    <li key={i} className="text-sm text-cyan-400 font-medium">
                      • {resource}
                    </li>
                  ))}
                </ul>
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl bg-gradient-to-br',
                    block.color
                  )}
                  style={{ transform: 'scale(0.95)' }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
