'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Howl } from 'howler'
import { Phone, PhoneOff, ChevronRight, Lock, MicOff, Volume2 } from 'lucide-react'
import { AvatarAgente0 } from './avatar-agente-0'
import { Transcricao } from './transcricao'
import { criarHowlAgente0, playSfx, stopSfx } from '@/lib/game/sounds'
import { obterScriptPersonalizado, type ScriptAgente } from '@/lib/game/scripts-agente-0'
import { useGameStore } from '@/lib/game/store'
import type { ClasseNivel, Nivel } from '@/lib/game/levels'

interface Agente0ModalProps {
  aberto: boolean
  nivel: Nivel | null
  classe: ClasseNivel | null
  somAtivo: boolean
  onAtendida: () => void
  onEncerrar: () => void
}

/**
 * Wrapper: só monta o conteúdo real quando a chamada está ativa e há nível.
 * Remontar a cada abertura dá reset natural de states — sem setState síncrono
 * dentro de useEffect.
 */
export function Agente0Modal(props: Agente0ModalProps) {
  const nomeOperador = useGameStore((s) => s.nomeOperador)
  if (!props.aberto || !props.nivel) return null
  const script = obterScriptPersonalizado(props.nivel, nomeOperador)
  return (
    <Agente0ModalInner
      nivel={props.nivel}
      classe={props.classe}
      script={script}
      somAtivo={props.somAtivo}
      onAtendida={props.onAtendida}
      onEncerrar={props.onEncerrar}
    />
  )
}

interface InnerProps {
  nivel: Nivel
  classe: ClasseNivel | null
  script: ScriptAgente
  somAtivo: boolean
  onAtendida: () => void
  onEncerrar: () => void
}

type Fase = 'tocando' | 'em-chamada' | 'encerrada'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary'

function Agente0ModalInner({
  nivel,
  classe,
  script,
  somAtivo,
  onAtendida,
  onEncerrar,
}: InnerProps) {
  const [fase, setFase] = useState<Fase>('tocando')
  const [erroAudio, setErroAudio] = useState(false)
  const [tempoDecorrido, setTempoDecorrido] = useState(0)
  const [mudo, setMudo] = useState(false)

  const vozRef = useRef<Howl | null>(null)
  const tickRef = useRef<number | null>(null)
  const fallbackTimerRef = useRef<number | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  const encerrarChamada = useCallback(() => {
    stopSfx('ringtone')
    if (vozRef.current) {
      vozRef.current.stop()
      vozRef.current.unload()
      vozRef.current = null
    }
    if (tickRef.current) {
      window.clearInterval(tickRef.current)
      tickRef.current = null
    }
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
    playSfx('beep', somAtivo)
    setFase('encerrada')
  }, [somAtivo])

  // Toca ringtone no mount. Limpa tudo no unmount.
  useEffect(() => {
    if (somAtivo) playSfx('ringtone', true)
    return () => {
      stopSfx('ringtone')
      if (vozRef.current) {
        vozRef.current.stop()
        vozRef.current.unload()
        vozRef.current = null
      }
      if (tickRef.current) window.clearInterval(tickRef.current)
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Focus trap + restauração do foco anterior.
  useEffect(() => {
    const previousFocus =
      typeof document !== 'undefined'
        ? (document.activeElement as HTMLElement | null)
        : null

    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const modal = modalRef.current
      if (!modal) return
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (previousFocus && typeof previousFocus.focus === 'function') {
        previousFocus.focus()
      }
    }
  }, [])

  // ESC só fecha após a chamada encerrar.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && fase === 'encerrada') onEncerrar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fase, onEncerrar])

  const atender = useCallback(() => {
    stopSfx('ringtone')
    onAtendida()
    setFase('em-chamada')

    tickRef.current = window.setInterval(() => {
      setTempoDecorrido((t) => t + 1)
    }, 1000)

    // Sem som: usa a duração nominal do script como fallback total.
    if (!somAtivo) {
      fallbackTimerRef.current = window.setTimeout(
        encerrarChamada,
        script.duracaoSegundos * 1000 + 800,
      )
      return
    }

    const howl = criarHowlAgente0(script.audioSrc)
    if (!howl) return
    vozRef.current = howl

    // Safety net: se nada disparar 'end' em 90s, encerra. Em cenário normal,
    // o evento 'end' do Howler fecha bem antes — com áudio real completo.
    fallbackTimerRef.current = window.setTimeout(() => {
      encerrarChamada()
    }, 90_000)

    howl.once('loaderror', () => {
      setErroAudio(true)
      // sem áudio, encerra na duração nominal do script
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = window.setTimeout(
        encerrarChamada,
        script.duracaoSegundos * 1000 + 800,
      )
    })
    howl.once('playerror', () => setErroAudio(true))
    howl.once('end', () => {
      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = null
      }
      encerrarChamada()
    })
    howl.play()
  }, [script, somAtivo, onAtendida, encerrarChamada])

  const toggleMudo = useCallback(() => {
    setMudo((m) => {
      const novo = !m
      if (vozRef.current) vozRef.current.mute(novo)
      return novo
    })
  }, [])

  const mmss = `${String(Math.floor(tempoDecorrido / 60)).padStart(2, '0')}:${String(tempoDecorrido % 60).padStart(2, '0')}`

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agente-0-titulo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[60] overflow-hidden touch-manipulation"
      >
        {/* Background estilo WhatsApp: blur do avatar + overlay dark quase opaco */}
        <div aria-hidden className="absolute inset-0">
          <AvatarAgente0
            size={1000}
            className="w-full h-full scale-125 blur-3xl opacity-30"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-zinc-950/92 via-zinc-950/96 to-zinc-950"
        />

        {/* Conteúdo */}
        <div className="relative h-full w-full flex flex-col">
          {/* Topo — cabeçalho da chamada (WhatsApp caption) */}
          <div className="pt-[max(env(safe-area-inset-top,0px),2.5rem)] px-6 text-center">
            <div className="inline-flex items-center gap-1.5 text-zinc-300/90 font-exo2 text-[13px]">
              <Lock className="w-3 h-3" aria-hidden />
              chamada de voz · criptografada
            </div>
            <div className="mt-1 text-[11px] text-zinc-500 font-exo2">
              nível {nivel}
              {classe && <> · {classe.toLowerCase()}</>}
            </div>
          </div>

          {/* Hero — avatar + identidade (estilo WhatsApp fiel) */}
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="relative">
              {/* Pulse ring único e sutil enquanto chama */}
              {fase === 'tocando' && (
                <motion.div
                  aria-hidden
                  className="absolute inset-[-16px] rounded-full border border-white/15"
                  animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <AvatarAgente0
                size={fase === 'em-chamada' ? 120 : 168}
                priority
                className={`rounded-full transition-all duration-500 shadow-[0_8px_40px_rgba(0,0,0,0.6)] ${fase === 'em-chamada' ? 'w-28 h-28' : 'w-40 h-40 md:w-44 md:h-44'}`}
              />
            </div>

            <h2
              id="agente-0-titulo"
              className={`mt-7 font-exo2 font-semibold text-zinc-50 tracking-tight transition-all duration-500 ${fase === 'em-chamada' ? 'text-[26px]' : 'text-[30px] md:text-[34px]'}`}
            >
              Agente 0
            </h2>

            {fase === 'tocando' && (
              <motion.p
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-1.5 text-[15px] text-zinc-400 font-exo2"
              >
                chamando...
              </motion.p>
            )}

            {fase === 'em-chamada' && (
              <p className="mt-1.5 text-[15px] text-zinc-400 font-exo2 tabular-nums">
                {mmss}
              </p>
            )}

            {fase === 'encerrada' && (
              <p className="mt-1.5 text-[13px] text-zinc-500 font-exo2">
                chamada encerrada
              </p>
            )}

            {fase === 'em-chamada' && (
              <div className="mt-8 w-full max-w-lg">
                {erroAudio && (
                  <p
                    role="alert"
                    className="mx-auto mb-4 max-w-xs text-xs text-orange-300 font-exo2 bg-orange-500/10 border border-orange-500/30 rounded-lg px-3 py-2 text-center"
                  >
                    áudio indisponível. siga pela transcrição.
                  </p>
                )}
                <div className="rounded-xl border border-cyan-500/20 bg-zinc-950/60 backdrop-blur-md px-4 py-3">
                  <div className="flex items-center gap-2 mb-2 font-hud text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                    <span className="relative inline-flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    </span>
                    transcrição ao vivo
                  </div>
                  <Transcricao
                    linhas={script.transcricao}
                    duracaoSegundos={script.duracaoSegundos}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom — ação */}
          <div className="pb-[max(env(safe-area-inset-bottom,0px),2.5rem)] pt-4 px-6">
            {fase === 'tocando' && (
              <div className="flex items-end justify-center gap-20 md:gap-28">
                {/* Recusar */}
                <button
                  type="button"
                  onClick={encerrarChamada}
                  aria-label="recusar chamada"
                  className="group flex flex-col items-center gap-2.5 cursor-pointer touch-manipulation"
                >
                  <span className="w-[68px] h-[68px] md:w-[72px] md:h-[72px] rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-lg shadow-black/40 transition-all active:scale-95">
                    <PhoneOff className="w-7 h-7 text-white" aria-hidden />
                  </span>
                  <span className="text-zinc-300 text-[13px] font-exo2">recusar</span>
                </button>

                {/* Atender */}
                <button
                  type="button"
                  onClick={atender}
                  autoFocus
                  aria-label="atender chamada"
                  className="group flex flex-col items-center gap-2.5 cursor-pointer touch-manipulation"
                >
                  <motion.span
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-[68px] h-[68px] md:w-[72px] md:h-[72px] rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-lg shadow-black/40 transition-colors active:scale-95"
                  >
                    <Phone className="w-7 h-7 text-white" aria-hidden />
                  </motion.span>
                  <span className="text-zinc-300 text-[13px] font-exo2">atender</span>
                </button>
              </div>
            )}

            {fase === 'em-chamada' && (
              <div className="flex items-end justify-center gap-6 md:gap-8">
                <button
                  type="button"
                  onClick={toggleMudo}
                  aria-label={mudo ? 'ativar microfone' : 'silenciar microfone'}
                  aria-pressed={mudo}
                  className="group flex flex-col items-center gap-2 cursor-pointer touch-manipulation"
                >
                  <span
                    className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-95 ${
                      mudo
                        ? 'bg-white/95 text-zinc-900'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <MicOff className="w-5 h-5" aria-hidden />
                  </span>
                  <span className="text-zinc-400 text-[11px] font-exo2">mudo</span>
                </button>

                <button
                  type="button"
                  disabled
                  aria-label="viva voz (indisponível)"
                  className="flex flex-col items-center gap-2 opacity-50 cursor-not-allowed"
                >
                  <span className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
                    <Volume2 className="w-5 h-5" aria-hidden />
                  </span>
                  <span className="text-zinc-400 text-[11px] font-exo2">viva-voz</span>
                </button>

                <button
                  type="button"
                  onClick={encerrarChamada}
                  aria-label="encerrar chamada"
                  className="group flex flex-col items-center gap-2 cursor-pointer touch-manipulation"
                >
                  <span className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center shadow-[0_8px_28px_rgba(239,68,68,0.45)] transition-all active:scale-95 group-hover:scale-105">
                    <PhoneOff className="w-7 h-7 text-white" aria-hidden />
                  </span>
                  <span className="text-zinc-400 text-[11px] font-exo2">encerrar</span>
                </button>
              </div>
            )}

            {fase === 'encerrada' && (
              <div className="mx-auto max-w-md space-y-4">
                <details className="text-left">
                  <summary className="cursor-pointer text-center font-hud text-[11px] uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors">
                    ver transcrição completa
                  </summary>
                  <div className="mt-3 space-y-2 text-sm text-zinc-300 font-exo2 bg-zinc-900/70 rounded-xl p-4 border border-zinc-800">
                    {script.transcricao.map((l, i) => (
                      <p key={i}>{l}</p>
                    ))}
                  </div>
                </details>

                <button
                  type="button"
                  onClick={onEncerrar}
                  autoFocus
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-orbitron font-bold uppercase tracking-wider shadow-[0_0_32px_rgba(6,182,212,0.45)] min-h-[56px] cursor-pointer touch-manipulation"
                >
                  continuar missão
                  <ChevronRight className="w-5 h-5" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
