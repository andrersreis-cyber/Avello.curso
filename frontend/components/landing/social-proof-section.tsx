'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Zap } from 'lucide-react'
import { VideoThumbnail } from './video-testimonial-modal'

async function irParaCheckout() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: 59.99, currency: 'BRL', content_name: 'Operador Anual',
    })
  }
  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'operador_anual', source: 'landing' }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  } catch {
    window.location.href = '/loja'
  }
}

const whatsappTestimonials = [
  {
    name: 'Gustavo Fabre',
    image: '/images/social-proof/gustavo.png',
    highlight: '"É um atalho pronto... Depois que entrei, fiquei de bobeira."',
    role: 'Empreendedor',
    caseStudy: 'Explorou templates n8n e chatbots para acelerar projetos',
    badge: null,
  },
  {
    name: 'Vitória',
    image: '/images/social-proof/vitoria.png',
    highlight: '"Cobrei R$250, paguei R$39... Já pagou a plataforma no primeiro job"',
    role: 'Freelancer',
    caseStudy: 'Entrou quando ainda era R$39 — hoje já está em R$59,99',
    badge: '⚡ Entrou por R$39'
  },
  {
    name: 'Matheus',
    image: '/images/social-proof/matheus.png',
    highlight: '"Cobrei R$500 + R$300/mês... Tá muito barato, R$39 no plano anual"',
    role: 'Desenvolvedor',
    caseStudy: 'Entrou quando ainda era R$39 — hoje já está em R$59,99',
    badge: '⚡ Entrou por R$39'
  },
  {
    name: 'Cliente',
    image: '/images/demo/prova-social-1.png',
    highlight: '"Isso não é gasto nem investimento. Mudei a forma de trampar. Organização e tudo!"',
    role: 'WhatsApp',
    caseStudy: 'Usou templates para organizar operação e atendimento',
    badge: null,
  },
  {
    name: 'Cliente',
    image: '/images/demo/prova-social-2.png',
    highlight: '"Muito surpreso com a quantidade de coisa boa. Essa SaaS roda perfeito. Automatizei meus canais de corte no YouTube"',
    role: 'WhatsApp',
    caseStudy: 'Usou white-label para criar oferta recorrente',
    badge: null,
  }
]

export function SocialProofSection() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    await irParaCheckout()
    setLoading(false)
  }

  return (
    <section className="py-20 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/30 mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">Depoimentos Reais</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Quem entrou, não sai mais
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Veja o que nossos membros estão dizendo sobre a plataforma
          </p>
        </div>

        {/* Grid - provas sociais (depoimentos WhatsApp + vídeos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whatsappTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border-2 border-zinc-800 hover:border-green-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20 bg-zinc-900"
            >
              {/* WhatsApp Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded z-10">
                WhatsApp
              </div>
              {/* Badge de preço antigo */}
              {testimonial.badge && (
                <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500/90 text-white text-xs font-bold rounded z-10">
                  {testimonial.badge}
                </div>
              )}

              {/* Image */}
              <div className="relative w-full aspect-[9/19.5]">
                <Image
                  src={testimonial.image}
                  alt={`Depoimento de ${testimonial.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay SEMPRE visível — depoimento legível no mobile (sem hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium leading-relaxed line-clamp-3">
                    {testimonial.highlight}
                  </p>
                  <p className="text-zinc-300 text-xs mt-1">— {testimonial.name}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Vídeos - prova social */}
          <div>
            <VideoThumbnail
              videoId="g9T6TSR30Tc"
              title="Depoimento em Vídeo"
              description="Assista ao depoimento completo"
            />
          </div>
          <div>
            <VideoThumbnail
              videoId="7tx1_fW5Y9M"
              title="Plataforma em ação"
              description="Veja o que nossos clientes usam"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-zinc-400 mb-2">
            Junte-se a quem já está lucrando com a Avello
          </p>
          <p className="text-sm text-orange-400 font-medium mb-5">
            Vitória e Matheus entraram por R$39. Hoje está em R$59,99. Próxima virada: R$99.
          </p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-70 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
          >
            <Zap className="w-5 h-5" />
            {loading ? 'Abrindo checkout...' : 'Garantir por R$59,99 — antes de virar R$99'}
          </button>
        </div>
      </div>
    </section>
  )
}
