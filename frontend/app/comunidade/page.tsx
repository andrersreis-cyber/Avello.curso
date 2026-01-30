'use client'

import { 
  MessageCircle, 
  Users, 
  Zap, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Bot,
  Workflow,
  Lightbulb,
  Share2,
  Crown,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

const TELEGRAM_LINK = 'https://t.me/+LgHnVN3B_81hYzA5'

const benefits = [
  {
    icon: <Workflow className="w-6 h-6" />,
    title: 'Compartilhe Automações',
    description: 'Mostre suas criações em n8n e receba feedback da comunidade'
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: 'Tire Dúvidas',
    description: 'Peça ajuda e aprenda com outros membros experientes'
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: 'Networking',
    description: 'Conecte-se com profissionais de automação e IA'
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'Novidades em IA',
    description: 'Fique por dentro das últimas tendências e ferramentas'
  }
]

const features = [
  'Acesso a conteúdos exclusivos',
  'Suporte da comunidade 24/7',
  'Networking com profissionais',
  'Dicas e truques de automação',
  'Avisos de novas ferramentas',
  'Oportunidades de negócio'
]

export default function ComunidadePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header simples */}
      <header className="h-16 bg-zinc-900 border-b border-zinc-700 flex items-center px-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar para Área de Membros</span>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Comunidade Exclusiva</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Junte-se à Comunidade
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Avello Automações
              </span>
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Conecte-se com outros membros, tire dúvidas, compartilhe suas automações 
              e fique por dentro das novidades em IA e automação.
            </p>

            {/* CTA Button */}
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              Entrar no Telegram
              <ArrowRight className="w-5 h-5" />
            </a>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Grátis</div>
                <div className="text-sm text-zinc-500">Para membros</div>
              </div>
              <div className="w-px h-12 bg-zinc-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-zinc-500">Suporte ativo</div>
              </div>
              <div className="w-px h-12 bg-zinc-700" />
              <div className="text-center">
                <div className="flex items-center gap-1 text-3xl font-bold text-white">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  VIP
                </div>
                <div className="text-sm text-zinc-500">Acesso exclusivo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            O que você encontra na comunidade
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700 hover:border-cyan-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-zinc-400 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl p-8 md:p-12 border border-zinc-700">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Benefícios Exclusivos</h2>
                <p className="text-zinc-400">Para membros da comunidade</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all"
            >
              <Zap className="w-5 h-5" />
              Entrar Agora - É Grátis!
            </a>
          </div>
        </div>
      </section>

      {/* Telegram Preview */}
      <section className="py-16 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Como funciona?</h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Nossa comunidade funciona através do Telegram. É simples, rápido e você 
            recebe notificações das novidades diretamente no seu celular.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-4 px-6 py-4 bg-zinc-800 rounded-xl border border-zinc-700">
              <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">Avello Automações</div>
                <div className="text-sm text-zinc-400">Grupo no Telegram</div>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-zinc-600 rotate-90 md:rotate-0" />

            <div className="px-6 py-4 bg-zinc-800 rounded-xl border border-zinc-700">
              <div className="text-sm text-zinc-400 mb-1">Clique no botão</div>
              <div className="font-semibold text-cyan-400">Entrar no Grupo</div>
            </div>

            <ArrowRight className="w-6 h-6 text-zinc-600 rotate-90 md:rotate-0" />

            <div className="px-6 py-4 bg-zinc-800 rounded-xl border border-zinc-700">
              <div className="text-sm text-zinc-400 mb-1">Pronto!</div>
              <div className="font-semibold text-green-400">Você está na comunidade</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para fazer parte?
          </h2>
          <p className="text-zinc-400 mb-8">
            Junte-se a outros profissionais de automação e IA
          </p>
          <a
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25"
          >
            <MessageCircle className="w-6 h-6" />
            Entrar no Telegram
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 text-center text-zinc-500 text-sm">
          © 2026 Avello. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
