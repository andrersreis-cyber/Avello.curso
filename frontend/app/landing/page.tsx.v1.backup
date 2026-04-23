'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UrgencyBanner } from '@/components/landing/urgency-banner'
import { HeroSection } from '@/components/landing/hero-section'
import { DemoSection } from '@/components/landing/demo-section'
import { ModulesShowcase } from '@/components/landing/modules-showcase'
import { MoneyMakingSection } from '@/components/landing/money-making-section'
import { PremiumComparison } from '@/components/landing/premium-comparison'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { SocialProofSection } from '@/components/landing/social-proof-section'
import { Zap, Shield, Star, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '#como-funciona', label: 'Como funciona', ariaLabel: 'Ir para seção Como Funciona' },
  { href: '#demo', label: 'Demo', ariaLabel: 'Ir para seção Demo' },
  { href: '#recursos', label: 'Recursos', ariaLabel: 'Ir para seção Recursos' },
  { href: '#precos', label: 'Preços', ariaLabel: 'Ir para seção Preços' },
  { href: '#depoimentos', label: 'Depoimentos', ariaLabel: 'Ir para seção Depoimentos' },
]

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false)
  const [precosInView, setPrecosInView] = useState(false)

  // Sticky CTA: visível após 500px scroll, esconde quando #precos está na viewport
  useEffect(() => {
    const handleScroll = () => setStickyCtaVisible(typeof window !== 'undefined' && window.scrollY > 500)
    const el = typeof document !== 'undefined' ? document.getElementById('precos') : null
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setPrecosInView(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const showStickyCta = stickyCtaVisible && !precosInView

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Urgency Banner (sticky após scroll) */}
      <UrgencyBanner />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/images/logo-avello.png" alt="Avello" width={32} height={32} className="rounded-lg" />
            <span className="text-xl font-bold text-cyan-400">AVELLO</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="py-2 px-3 text-zinc-400 hover:text-white transition-colors" aria-label={link.ariaLabel}>
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/login" className="py-2 px-3 min-h-[44px] flex items-center text-zinc-400 hover:text-white transition-colors hidden sm:block" aria-label="Ir para página de login">
              Entrar
            </Link>
            <Link 
              href="/cadastro"
              className="px-4 py-2 min-h-[44px] flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/25"
            >
              Começar Agora
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-zinc-950 border-l border-zinc-800 p-6 md:hidden">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-3 px-4 min-h-[44px] flex items-center text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-4 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
              >
                Entrar
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* Sticky CTA mobile */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 md:hidden transition-transform duration-300"
        style={{ transform: showStickyCta ? 'translateY(0)' : 'translateY(100%)' }}
      >
        <Link
          href="/loja"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-cyan-500/25"
        >
          <Zap className="w-5 h-5" />
          Acesso Completo — R$ 39/ano
        </Link>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Como funciona */}
      <HowItWorksSection />

      {/* Demo Section */}
      <DemoSection />

      {/* Modules Showcase - Recursos */}
      <ModulesShowcase />

      {/* Money Making Section - Oportunidades */}
      <MoneyMakingSection />

      {/* Social Proof - Depoimentos (validação antes do pricing) */}
      <div id="depoimentos">
        <SocialProofSection />
      </div>

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
                q: 'O que está incluído no Plano Starter?',
                a: 'O Starter custa R$14,90/ano e inclui 20 templates n8n selecionados, 3 downloads por semana, uso comercial e acesso à comunidade Telegram. É perfeito para conhecer a plataforma antes de fazer upgrade.'
              },
              {
                q: 'E se eu não gostar do Premium?',
                a: 'Garantia de 7 dias. Se não gostar por qualquer motivo, devolvemos 100% do seu dinheiro, sem perguntas. Você não tem nada a perder.'
              },
              {
                q: 'Como eu ganho dinheiro com a Avello?',
                a: 'Use os templates para clientes (atendimento, automações, chatbots), revenda os SaaS white label, implemente fluxos n8n para empresas ou crie conteúdo com IA. Um único projeto paga o Premium inteiro.'
              },
              {
                q: 'Os templates são atualizados?',
                a: 'Sim! Adicionamos novos recursos toda semana. Com o Premium ou Premium Pro, você tem acesso a todas as atualizações durante o período da assinatura.'
              },
              {
                q: 'Vale a pena pagar R$39 pelo Premium?',
                a: 'Um único uso relevante já tende a pagar o investimento. O Premium foi montado para quem quer liberdade total de monetização — vender automações, implementar chatbots, usar IA em clientes. Se não gostar, garantia de 7 dias com reembolso total.'
              },
              {
                q: 'Isso serve para iniciantes?',
                a: 'Sim! A maioria dos recursos vem pronta para usar. Você escolhe, personaliza e entrega. Não precisa ser técnico para começar.'
              },
              {
                q: 'Como isso se paga?',
                a: 'Um projeto de R$ 250 ou uma implementação de chatbot já cobre o ano. O restante é lucro. E se não gostar, garantia de 7 dias.'
              },
              {
                q: 'Qual plano faz mais sentido para mim?',
                a: 'Starter: para conhecer a plataforma. Premium: para quem quer transformar IA em renda — vender, implementar e escalar. É a escolha da maioria.'
              },
              {
                q: 'Posso fazer upgrade do Starter para Premium depois?',
                a: 'Sim! A qualquer momento você pode fazer upgrade. E o melhor: por apenas R$24 a mais (diferença de R$14,90 para R$39), você desbloqueia todos os 6.000+ recursos.'
              },
              {
                q: 'Posso usar os recursos comercialmente?',
                a: 'Sim! Todos os recursos podem ser usados comercialmente. Implemente para clientes, revenda SaaS e use em seus projetos.'
              },
              {
                q: 'Tem garantia?',
                a: 'Sim! O plano Premium tem 7 dias de garantia total. Não gostou? Devolvemos 100% do seu dinheiro.'
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
              <span>+18.000 recursos disponíveis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>Acesso imediato</span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Um único projeto paga o ano inteiro
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
            Copie um template, venda por R$250+ e o Premium já se pagou. Garantia de 7 dias — não gostou, devolvemos 100%.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-xl transition-all shadow-2xl shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-105"
            >
              <Zap className="w-6 h-6" />
              Acesso Completo — R$ 39/ano
            </Link>
            <Link
              href="/cadastro"
              className="inline-flex items-center justify-center py-3 min-h-[44px] text-zinc-400 hover:text-white text-lg transition-colors"
            >
              Ou começar por R$ 14,90
            </Link>
          </div>

          <p className="text-sm text-zinc-500 mt-4">
            Garantia 7 dias · Acesso imediato · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image src="/images/logo-avello.png" alt="Avello" width={32} height={32} className="rounded-lg" />
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
