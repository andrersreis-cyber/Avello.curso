'use client'

import { Search, Edit3, DollarSign, ArrowRight } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Escolha',
    desc: 'Selecione um template, chatbot ou prompt pronto da biblioteca',
  },
  {
    icon: Edit3,
    title: 'Personalize',
    desc: 'Adapte para seu nicho ou cliente em minutos',
  },
  {
    icon: DollarSign,
    title: 'Monetize',
    desc: 'Entregue, implemente ou ganhe produtividade — sem começar do zero',
  },
]

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como funciona em 3 passos
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Simples assim. Sem curva de aprendizado. Você começa a gerar resultado hoje.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={i}
                className="relative p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl font-bold text-zinc-700">{i + 1}</span>
                  <Icon className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400">{step.desc}</p>
                {i < 2 && (
                  <ArrowRight className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-zinc-600 hidden md:block" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
