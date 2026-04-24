'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { PERGUNTAS_QUIZ, type RespostasQuiz } from '@/lib/game/levels'
import { playSfx } from '@/lib/game/sounds'
import { XpParticleLayer } from '../shared/xp-particle'
import { useXpParticles } from '../shared/use-xp-particles'

interface Ato2QuizProps {
  onConcluir: (respostas: RespostasQuiz) => void
  somAtivo: boolean
}

type EtapaRespostas = [number | null, number | null, number | null]

export function Ato2Quiz({ onConcluir, somAtivo }: Ato2QuizProps) {
  const [passo, setPasso] = useState<0 | 1 | 2>(0)
  const [respostas, setRespostas] = useState<EtapaRespostas>([null, null, null])
  const [calculando, setCalculando] = useState(false)

  const pergunta = PERGUNTAS_QUIZ[passo]
  const selecionada = respostas[passo]

  const { eventos, dispararXp, removerEvento } = useXpParticles()

  function handleSelecionar(peso: 1 | 2 | 3 | 4, origemEl: HTMLElement | null) {
    playSfx('click', somAtivo)

    // XP por resposta (quanto maior a resposta, mais XP — mas todos ganham algo)
    dispararXp(50 + peso * 10, origemEl)

    const prox: EtapaRespostas = [...respostas] as EtapaRespostas
    prox[passo] = peso
    setRespostas(prox)

    window.setTimeout(() => {
      if (passo < 2) {
        setPasso((p) => (p + 1) as 0 | 1 | 2)
      } else {
        setCalculando(true)
        playSfx('tensionSpike', somAtivo)
        // Heartbeat crescente durante o scanner (5s de build-up)
        playSfx('heartbeat', somAtivo)
        // XP bônus no final do quiz (disparado do centro da tela)
        window.setTimeout(() => {
          const centerEl = document.getElementById('quiz-scanner-target')
          dispararXp(300, centerEl)
        }, 600)
        window.setTimeout(() => {
          onConcluir([prox[0]!, prox[1]!, prox[2]!])
        }, 2400)
      }
    }, 260)
  }

  return (
    <div className="relative min-h-[calc(100dvh-3.5rem)] flex items-start md:items-center justify-center px-4 pt-24 pb-16 md:py-24">
      <XpParticleLayer eventos={eventos} onConcluido={removerEvento} />
      <div className="max-w-2xl w-full">
        <header className="text-center mb-8 md:mb-10">
          <div className="font-hud text-[11px] uppercase tracking-[0.2em] text-zinc-500 mb-3">
            ato 2/5 · diagnóstico
          </div>
          <h2
            id="ato-2-titulo"
            className="font-orbitron font-bold text-zinc-50 leading-tight text-3xl md:text-4xl"
          >
            3 perguntas.{' '}
            <span className="text-neon-cyan neon-text-cyan">
              é o que separa operador de curioso.
            </span>
          </h2>
        </header>

        <div className="flex items-center justify-center gap-2 mb-8" role="list">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              role="listitem"
              aria-label={`pergunta ${i + 1} de 3`}
              className={`h-1.5 rounded-full transition-all ${
                i < passo || (i === passo && selecionada)
                  ? 'w-12 bg-neon-cyan shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                  : i === passo
                    ? 'w-12 bg-zinc-700'
                    : 'w-6 bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {calculando ? (
            <motion.div
              key="loader"
              id="quiz-scanner-target"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center gap-4 py-10"
            >
              {/* Scanner container */}
              <div
                className="relative w-64 h-32 md:w-80 md:h-40 rounded-xl border border-cyan-500/40 bg-zinc-950/80 overflow-hidden"
                aria-hidden
              >
                {/* Grid fundo */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />

                {/* Linha de scanner horizontal */}
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_12px_rgba(6,182,212,0.9)]"
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                />

                {/* Dados fake no terminal */}
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-1 px-4 font-mono text-[10px] md:text-xs text-neon-cyan/70 uppercase tracking-wider">
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    &gt; analisando respostas...
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  >
                    &gt; cruzando com base de 800 operadores
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
                  >
                    &gt; calculando trilha ideal...
                  </motion.span>
                </div>

                {/* Scanlines overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, rgba(6,182,212,0.3), rgba(6,182,212,0.3) 1px, transparent 1px, transparent 3px)',
                  }}
                />
              </div>

              <p className="font-hud text-sm uppercase tracking-widest text-neon-cyan">
                escaneando padrão de comportamento...
              </p>
              <p className="text-zinc-500 text-sm">
                agente 0 foi notificado. aguarda o sinal.
              </p>

              <Loader2
                className="w-4 h-4 text-zinc-500 animate-spin"
                aria-hidden
              />
            </motion.div>
          ) : (
            <motion.div
              key={`p-${passo}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="font-orbitron text-xl md:text-2xl font-semibold text-zinc-100 mb-6">
                {pergunta.titulo}
              </h3>

              <div className="grid gap-3">
                {pergunta.opcoes.map((opcao) => {
                  const escolhida = selecionada === opcao.peso
                  return (
                    <button
                      key={opcao.peso}
                      type="button"
                      onClick={(e) => handleSelecionar(opcao.peso, e.currentTarget)}
                      disabled={selecionada !== null}
                      aria-pressed={escolhida}
                      className={`group w-full text-left rounded-xl border bg-zinc-900/60 px-5 py-4 min-h-[56px] flex items-center gap-3 transition-colors ${
                        escolhida
                          ? 'border-cyan-500 bg-cyan-500/10 neon-glow-cyan'
                          : 'border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900'
                      } disabled:cursor-not-allowed`}
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-md border font-hud text-xs shrink-0 transition-colors ${
                          escolhida
                            ? 'border-neon-cyan text-neon-cyan bg-cyan-500/20'
                            : 'border-zinc-700 text-zinc-500 group-hover:border-cyan-500/70 group-hover:text-neon-cyan'
                        }`}
                      >
                        {escolhida ? (
                          <Check className="w-3.5 h-3.5" aria-hidden />
                        ) : (
                          String.fromCharCode(65 + opcao.peso - 1)
                        )}
                      </span>
                      <span className="text-zinc-200 font-exo2 text-sm md:text-base">
                        {opcao.texto}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
