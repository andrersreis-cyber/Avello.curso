'use client'

import Link from 'next/link'
import { UrgencyBanner } from '@/components/landing/urgency-banner'
import { HeroSection } from '@/components/landing/hero-section'
import { ModulesShowcase } from '@/components/landing/modules-showcase'
import { MoneyMakingSection } from '@/components/landing/money-making-section'
import { PremiumComparison } from '@/components/landing/premium-comparison'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { Zap, Shield, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Urgency Banner (sticky após scroll) */}
      <UrgencyBanner />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo-avello.png" alt="Avello" className="h-8 w-8 rounded-lg" />
            <span className="text-xl font-bold text-cyan-400">AVELLO</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#recursos" className="text-zinc-400 hover:text-white transition-colors">Recursos</a>
            <a href="#precos" className="text-zinc-400 hover:text-white transition-colors">Preços</a>
            <a href="#depoimentos" className="text-zinc-400 hover:text-white transition-colors">Depoimentos</a>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Entrar
            </Link>
            <Link 
              href="/cadastro"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/25"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Social Proof - MOVIDO PARA CIMA */}
      <div id="depoimentos">
        <SocialProofSection />
      </div>

      {/* Modules Showcase */}
      <ModulesShowcase />

      {/* Money Making Section */}
      <MoneyMakingSection />

      {/* Premium Comparison */}
      <PremiumComparison />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-zinc-400">Tudo que você precisa saber</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'O que está incluído no plano gratuito?',
                a: 'O plano gratuito dá acesso completo aos +2500 templates n8n. Você pode baixar, usar e modificar todos os fluxos de automação sem qualquer limitação.'
              },
              {
                q: 'Preciso de cartão de crédito para o plano gratuito?',
                a: 'Não! O plano gratuito é 100% grátis, sem necessidade de cartão de crédito ou qualquer pagamento. Basta criar sua conta e começar a usar.'
              },
              {
                q: 'Por quanto tempo o plano gratuito é válido?',
                a: 'O plano gratuito é vitalício. Você terá acesso aos templates n8n para sempre, sem prazo de validade.'
              },
              {
                q: 'O que ganho ao fazer upgrade para o plano Premium?',
                a: 'Com o Premium você desbloqueia todos os +6000 recursos: chatbots, prompts ChatGPT e Midjourney, templates Typebot, ferramentas IA, SaaS white label e bônus exclusivos.'
              },
              {
                q: 'Posso usar os recursos comercialmente?',
                a: 'Sim! Todos os recursos podem ser usados comercialmente. Você pode implementar para clientes, revender SaaS e usar em seus próprios projetos.'
              },
              {
                q: 'Tem garantia?',
                a: 'Sim! O plano Premium tem 7 dias de garantia total. Se não gostar, devolvemos 100% do seu dinheiro, sem perguntas.'
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden"
              >
                <summary className="cursor-pointer p-5 font-medium text-white hover:bg-zinc-800/80 transition-colors list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-zinc-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-zinc-400 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Garantia 7 dias</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>+800 usuários</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Acesso imediato</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para automatizar seu negócio?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Entre grátis agora e tenha acesso a <span className="text-white font-semibold">+2500 templates n8n</span>
          </p>
          
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-xl transition-all shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-105"
          >
            <Zap className="w-6 h-6" />
            Começar Grátis Agora
          </Link>

          <p className="text-sm text-zinc-500 mt-4">
            Sem cartão de crédito • Acesso em menos de 1 minuto
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src="/images/logo-avello.png" alt="Avello" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold text-cyan-400">AVELLO</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
              <Link href="/suporte" className="hover:text-white transition-colors">Suporte</Link>
              <Link href="/comunidade" className="hover:text-white transition-colors">Comunidade</Link>
              <Link href="/afiliados" className="hover:text-white transition-colors">Afiliados</Link>
              <Link href="/termos" className="hover:text-white transition-colors">Termos</Link>
              <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            </div>
            
            <p className="text-sm text-zinc-500">
              © 2026 Avello. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
