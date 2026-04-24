'use client'

import { FeedTerminal } from './feed-terminal'
import { BadgeIntelAtivo } from './badge-intel-ativo'

export function CentralIntel() {
  return (
    <section
      className="relative px-4 py-16 md:py-24 border-y border-cyan-500/10"
      aria-labelledby="central-intel-titulo"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_60%)]"
      />

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10 md:mb-12">
          <BadgeIntelAtivo className="mb-6" />
          <h2
            id="central-intel-titulo"
            className="font-orbitron font-bold text-3xl md:text-4xl text-zinc-50 leading-tight"
          >
            a ferramenta tá mudando toda semana.{' '}
            <span className="text-neon-cyan neon-text-cyan">você também.</span>
          </h2>
          <p className="mt-4 text-zinc-400 font-exo2 text-base md:text-lg max-w-2xl mx-auto">
            Claude Code, Skills, MCPs, Projects, Agent SDK.{' '}
            <span className="text-zinc-200">quem fica parado vira lenda.</span>
            <br className="hidden md:block" />
            <span className="block mt-2 md:mt-0">
              operadores Avello recebem atualização{' '}
              <span className="text-neon-cyan">toda semana</span> — direto no arsenal.
            </span>
          </p>
        </header>

        <FeedTerminal />

        <p className="mt-6 text-center text-xs font-hud uppercase tracking-[0.2em] text-zinc-500">
          fica por dentro antes de 99% dos devs · sem RSS, sem twitter, direto na plataforma
        </p>
      </div>
    </section>
  )
}
