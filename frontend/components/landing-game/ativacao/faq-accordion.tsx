import { ChevronDown } from 'lucide-react'
import { FAQ } from '@/lib/game/oferta'

export function FaqAccordion() {
  return (
    <section
      aria-labelledby="faq-titulo"
      className="max-w-2xl mx-auto space-y-3"
    >
      <h3
        id="faq-titulo"
        className="font-orbitron font-bold text-xl md:text-2xl text-center text-zinc-50 mb-6"
      >
        perguntas frequentes
      </h3>
      {FAQ.map((item, i) => (
        <details
          key={i}
          className="group rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden open:border-cyan-500/40 transition-colors"
        >
          <summary className="flex items-center justify-between gap-4 cursor-pointer px-5 py-4 list-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan rounded-xl">
            <span className="font-orbitron font-semibold text-zinc-100 text-base">
              {item.pergunta}
            </span>
            <ChevronDown
              className="w-5 h-5 text-neon-cyan transition-transform group-open:rotate-180 shrink-0"
              aria-hidden
            />
          </summary>
          <div className="px-5 pb-5 text-zinc-300 font-exo2 leading-relaxed">
            {item.resposta}
          </div>
        </details>
      ))}
    </section>
  )
}
