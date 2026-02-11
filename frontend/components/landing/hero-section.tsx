'use client'

import Link from 'next/link'
import { Zap, ArrowRight, Play, Users, Gift } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-500/30 mb-6 backdrop-blur-sm">
          <Gift className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400 font-medium">Comece GRÁTIS - Sem cartão de crédito</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Pare de criar automações do zero.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Copie, cole e fature.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
          +6.000 templates de automação, chatbots, prompts e SaaS prontos para usar no seu negócio. Comece grátis em 30 segundos.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="/cadastro"
            onClick={() => {
              if (window.fbq) {
                window.fbq('track', 'Lead', {
                  content_name: 'Cadastro Gratuito Avello (Hero)',
                  content_category: 'Landing Page'
                })
              }
            }}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            Começar Grátis Agora
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <a
            href="#recursos"
            className="flex items-center gap-2 px-8 py-4 bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-sm text-white rounded-xl font-medium text-lg transition-all border border-zinc-700 hover:border-zinc-600"
          >
            <Play className="w-5 h-5" />
            Ver Tudo Que Existe Dentro
          </a>
        </div>

        {/* Microcopy + Tech stack - em destaque */}
        <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-4 mb-6 rounded-2xl bg-zinc-900/60 border border-zinc-700/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-sm font-medium text-green-400">
              ✓ Sem cartão
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-sm font-medium text-cyan-400">
              ✓ Acesso imediato
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-sm font-medium text-purple-400">
              ✓ Atualizado toda semana
            </span>
          </div>
          <span className="hidden sm:inline w-px h-6 bg-zinc-600" />
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="text-sm text-zinc-400 font-medium uppercase tracking-wider">Integra com</span>
            <span className="text-sm font-semibold text-white">n8n</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">ChatGPT</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">Midjourney</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">Typebot</span>
            <span className="text-zinc-600">•</span>
            <span className="text-sm font-semibold text-white">WhatsApp</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm rounded-full border border-zinc-800">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-sm text-zinc-400">
            Mais de <span className="text-white font-semibold">800 empreendedores</span> já usam
          </span>
        </div>
      </div>
    </section>
  )
}
