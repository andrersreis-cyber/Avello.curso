'use client'

import Image from 'next/image'
import { Monitor, LayoutDashboard } from 'lucide-react'

// Prints das páginas da plataforma Avello
const PAGINAS_PLATAFORMA = [
  { src: '/images/demo/demo-pagina-1.png', label: 'Super Fluxos' },
  { src: '/images/demo/demo-pagina-2.png', label: 'Ferramentas IA' },
  { src: '/images/demo/demo-pagina-3.png', label: 'Templates n8n' },
  { src: '/images/demo/demo-pagina-4.png', label: 'Ferramentas Gratuitas' },
  { src: '/images/demo/demo-pagina-5.png', label: 'Prompts Midjourney' },
  { src: '/images/demo/demo-pagina-6.png', label: 'SaaS White Label' },
  { src: '/images/demo/demo-pagina-7.png', label: 'Templates Typebot' },
  { src: '/images/demo/demo-pagina-8.png', label: 'Self-Hosted' },
]

export function DemoSection() {
  return (
    <section id="demo" className="py-20 bg-zinc-900/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header - Demonstração = prints das páginas */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-4">
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Demonstração</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Veja exatamente o que você recebe
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Explore todas as páginas da plataforma antes de criar sua conta
          </p>
        </div>

        {/* Grid com prints das páginas da plataforma */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAGINAS_PLATAFORMA.map((pagina, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden border-2 border-zinc-800 hover:border-cyan-500/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/20 bg-zinc-900"
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={pagina.src}
                  alt={`${pagina.label} - Avello`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent && !parent.querySelector('.demo-placeholder')) {
                      const placeholder = document.createElement('div')
                      placeholder.className = 'demo-placeholder absolute inset-0 flex flex-col items-center justify-center bg-zinc-800/80 text-zinc-500 text-center p-4'
                      const emoji = document.createElement('span')
                      emoji.className = 'text-3xl mb-2'
                      emoji.textContent = '🖥️'
                      const label = document.createElement('span')
                      label.className = 'text-sm'
                      label.textContent = pagina.label
                      const hint = document.createElement('span')
                      hint.className = 'text-xs mt-1 opacity-70'
                      hint.textContent = `Adicione demo-pagina-${index + 1}.png`
                      placeholder.appendChild(emoji)
                      placeholder.appendChild(label)
                      placeholder.appendChild(hint)
                      parent.appendChild(placeholder)
                    }
                  }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">{pagina.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
