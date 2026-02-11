'use client'

import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import { VideoThumbnail } from './video-testimonial-modal'

const whatsappTestimonials = [
  {
    name: 'Gustavo Fabre',
    image: '/images/social-proof/gustavo.png',
    highlight: '"É um atalho pronto... Depois que entrei, fiquei de bobeira."',
    role: 'Empreendedor'
  },
  {
    name: 'Vitória',
    image: '/images/social-proof/vitoria.png',
    highlight: '"Cobrei R$250, paguei R$39... Já pagou a plataforma no primeiro job"',
    role: 'Freelancer'
  },
  {
    name: 'Matheus',
    image: '/images/social-proof/matheus.png',
    highlight: '"Cobrei R$500 + R$300/mês... Tá muito barato, R$39 no plano anual"',
    role: 'Desenvolvedor'
  }
]

export function SocialProofSection() {
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* WhatsApp Prints */}
          {whatsappTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border-2 border-zinc-800 hover:border-green-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20 bg-zinc-900"
            >
              {/* WhatsApp Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded z-10">
                WhatsApp
              </div>

              {/* Image */}
              <div className="relative w-full aspect-[9/19.5]">
                <Image
                  src={testimonial.image}
                  alt={`Depoimento de ${testimonial.name}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay with highlight on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Quote className="w-6 h-6 text-green-400 mb-2" />
                  <p className="text-white text-sm font-medium leading-relaxed mb-2">
                    {testimonial.highlight}
                  </p>
                  <p className="text-zinc-300 text-xs">
                    — {testimonial.name}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Video Testimonial */}
          <div className="md:col-span-1">
            <VideoThumbnail
              videoId="g9T6TSR30Tc"
              title="Depoimento em Vídeo"
              description="Assista ao depoimento completo"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-zinc-400 mb-4">
            Junte-se a centenas de empreendedores que já estão lucrando com a Avello
          </p>
          <a
            href="/cadastro"
            onClick={() => {
              if (window.fbq) {
                window.fbq('track', 'Lead', {
                  content_name: 'Cadastro Gratuito Avello (Social Proof)',
                  content_category: 'Landing Page'
                })
              }
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105"
          >
            Começar Grátis Agora
          </a>
        </div>
      </div>
    </section>
  )
}
