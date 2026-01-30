'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Zap, 
  Check, 
  ArrowRight, 
  Play,
  Star,
  Users,
  Shield,
  Gift,
  ChevronDown,
  Bot,
  Sparkles,
  Workflow,
  MessageSquare,
  Image,
  Server,
  ShoppingBag,
  Wrench,
  Lock,
  Rocket
} from 'lucide-react'
import { cn } from '@/lib/utils'

const modules = [
  { 
    icon: <Workflow className="w-6 h-6" />, 
    name: '+2000 Templates n8n', 
    desc: 'Fluxos de automação prontos',
    free: true,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    icon: <Rocket className="w-6 h-6" />, 
    name: '+58 Super Fluxos', 
    desc: 'Super Agentes de IA avançados',
    free: false,
    color: 'from-orange-500 to-red-500'
  },
  { 
    icon: <MessageSquare className="w-6 h-6" />, 
    name: '+3500 Prompts ChatGPT', 
    desc: 'Prompts profissionais',
    free: false,
    color: 'from-emerald-500 to-green-500'
  },
  { 
    icon: <Image className="w-6 h-6" />, 
    name: '+3500 Prompts Midjourney', 
    desc: 'Prompts para imagens',
    free: false,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    icon: <Bot className="w-6 h-6" />, 
    name: '+3000 Templates Typebot', 
    desc: 'Chatbots prontos',
    free: false,
    color: 'from-violet-500 to-purple-500'
  },
  { 
    icon: <Wrench className="w-6 h-6" />, 
    name: '+14 Mil Ferramentas IA', 
    desc: 'Diretório completo',
    free: false,
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    icon: <Server className="w-6 h-6" />, 
    name: '+350 Self-Hosted', 
    desc: 'Softwares para seu servidor',
    free: false,
    color: 'from-rose-500 to-red-500'
  },
  { 
    icon: <ShoppingBag className="w-6 h-6" />, 
    name: '+30 SaaS White Label', 
    desc: 'Prontos para revender',
    free: false,
    color: 'from-orange-500 to-amber-500'
  },
  { 
    icon: <Gift className="w-6 h-6" />, 
    name: '+8 Bônus Exclusivos', 
    desc: 'Conteúdo extra especial',
    free: false,
    color: 'from-yellow-500 to-orange-500'
  },
]

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Empresário',
    text: 'Os templates n8n me economizaram semanas de trabalho. Consegui automatizar todo meu negócio em poucos dias.',
    rating: 5
  },
  {
    name: 'Ana Santos',
    role: 'Social Media',
    text: 'Os prompts do ChatGPT são incríveis! Minha produtividade aumentou muito. Recomendo demais.',
    rating: 5
  },
  {
    name: 'Pedro Costa',
    role: 'Desenvolvedor',
    text: 'Melhor investimento que fiz. A quantidade de recursos é absurda pelo preço. Vale cada centavo.',
    rating: 5
  },
]

const faqs = [
  {
    q: 'O que está incluído no plano gratuito?',
    a: 'O plano gratuito dá acesso completo aos +2000 templates n8n. Você pode baixar, usar e modificar todos os fluxos de automação.'
  },
  {
    q: 'Preciso de cartão de crédito para o plano gratuito?',
    a: 'Não! O plano gratuito é 100% grátis, sem necessidade de cartão de crédito ou qualquer pagamento.'
  },
  {
    q: 'Por quanto tempo o plano gratuito é válido?',
    a: 'O plano gratuito é vitalício. Você terá acesso aos templates n8n para sempre.'
  },
  {
    q: 'O que ganho ao fazer upgrade para o plano Premium?',
    a: 'Com o Premium você desbloqueia todos os +6000 recursos: prompts, templates Typebot, ferramentas IA, SaaS e bônus exclusivos.'
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo-avello.png" alt="Avello" className="h-8 w-8 rounded-lg" />
            <span className="text-xl font-bold text-cyan-400">AVELLO</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#recursos" className="text-zinc-400 hover:text-white transition-colors">Recursos</a>
            <a href="#precos" className="text-zinc-400 hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="text-zinc-400 hover:text-white transition-colors">FAQ</a>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-medium transition-all"
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/30 mb-6">
            <Gift className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">+2000 Templates n8n GRÁTIS</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Automatize seu negócio com
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              +6000 recursos de IA
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Templates n8n, prompts ChatGPT e Midjourney, ferramentas de IA, 
            SaaS white label e muito mais. Comece grátis agora.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Começar Grátis
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <a
              href="#recursos"
              className="flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all border border-zinc-700"
            >
              <Play className="w-5 h-5" />
              Ver Recursos
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>+500 usuários</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>4.9/5 avaliação</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Garantia 7 dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="recursos" className="py-20 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Mais de 6.000 recursos para automatizar, criar e escalar seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((module, index) => (
              <div
                key={index}
                className={cn(
                  "relative p-6 rounded-2xl border transition-all",
                  module.free 
                    ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 hover:border-cyan-500/50"
                    : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                )}
              >
                {module.free ? (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    GRÁTIS
                  </div>
                ) : (
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-zinc-700 text-zinc-300 text-xs font-bold rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                  module.color,
                  !module.free && "opacity-50"
                )}>
                  {module.icon}
                </div>
                
                <h3 className={cn(
                  "text-lg font-semibold mb-1",
                  module.free ? "text-white" : "text-zinc-400"
                )}>{module.name}</h3>
                <p className="text-sm text-zinc-500">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comece grátis, upgrade quando quiser
            </h2>
            <p className="text-zinc-400">
              Sem pegadinhas. Plano gratuito para sempre.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Plano Gratuito</h3>
                <p className="text-zinc-400 text-sm">Perfeito para começar</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">R$ 0</span>
                <span className="text-zinc-500">/para sempre</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-300">+2000 Templates n8n</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-300">Download ilimitado</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-300">Uso comercial permitido</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-300">Comunidade no Telegram</span>
                </li>
              </ul>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl font-medium transition-all"
              >
                Criar Conta Grátis
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="relative bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full">
                MAIS POPULAR
              </div>
              
              {/* Badge de desconto */}
              <div className="absolute -top-4 -right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full rotate-12">
                80% OFF
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Plano Premium</h3>
                <p className="text-zinc-400 text-sm">Acesso completo por 12 meses</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl text-zinc-500 line-through">R$ 199</span>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-bold rounded">LANÇAMENTO</span>
                </div>
                <span className="text-4xl font-bold text-white">R$ 39</span>
                <span className="text-zinc-500">/ano</span>
                <p className="text-cyan-400 text-sm mt-1">Apenas R$ 3,25/mês</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">Tudo do plano Gratuito</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">+58 Super Fluxos de IA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">+3500 Prompts ChatGPT</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">+3500 Prompts Midjourney</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">+3000 Templates Typebot</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">+14 Mil Ferramentas IA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">+30 SaaS White Label</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-cyan-400" />
                  <span className="text-zinc-300">+8 Bônus Exclusivos</span>
                </li>
              </ul>
              
              <Link
                href="/loja"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all"
              >
                <Zap className="w-5 h-5" />
                Fazer Upgrade
              </Link>
              
              <p className="text-center text-xs text-zinc-500 mt-4">
                Garantia de 7 dias ou seu dinheiro de volta
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que nossos usuários dizem
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-zinc-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{testimonial.name}</p>
                    <p className="text-sm text-zinc-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-zinc-400 transition-transform",
                    openFaq === index && "rotate-180"
                  )} />
                </button>
                
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-zinc-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para automatizar seu negócio?
          </h2>
          <p className="text-zinc-400 mb-8">
            Comece grátis agora e tenha acesso a +2000 templates n8n
          </p>
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25"
          >
            <Zap className="w-5 h-5" />
            Começar Grátis Agora
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <img src="/images/logo-avello.png" alt="Avello" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold text-cyan-400">AVELLO</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-zinc-500">
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
