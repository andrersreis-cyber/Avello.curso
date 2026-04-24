'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { COUNTDOWN_HORAS, COUNTDOWN_STORAGE_KEY } from '@/lib/game/oferta'

interface CountdownRemaining {
  horas: number
  minutos: number
  segundos: number
  expirou: boolean
}

const JANELA_MS = COUNTDOWN_HORAS * 60 * 60 * 1000

function lerInicio(): Date {
  if (typeof window === 'undefined') return new Date()
  const existente = window.localStorage.getItem(COUNTDOWN_STORAGE_KEY)
  if (existente) {
    const d = new Date(existente)
    if (!Number.isNaN(d.getTime())) return d
  }
  const agora = new Date()
  window.localStorage.setItem(COUNTDOWN_STORAGE_KEY, agora.toISOString())
  return agora
}

function calcularRestante(inicio: Date): CountdownRemaining {
  const restanteMs = inicio.getTime() + JANELA_MS - Date.now()
  if (restanteMs <= 0) {
    return { horas: 0, minutos: 0, segundos: 0, expirou: true }
  }
  const totalSeg = Math.floor(restanteMs / 1000)
  return {
    horas: Math.floor(totalSeg / 3600),
    minutos: Math.floor((totalSeg % 3600) / 60),
    segundos: totalSeg % 60,
    expirou: false,
  }
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

const ZERO: CountdownRemaining = { horas: 0, minutos: 0, segundos: 0, expirou: false }

export function Countdown24h() {
  const [restante, setRestante] = useState<CountdownRemaining>(ZERO)
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    const inicio = lerInicio()
    const raf = window.requestAnimationFrame(() => {
      setRestante(calcularRestante(inicio))
      setPronto(true)
    })

    const id = window.setInterval(() => {
      setRestante(calcularRestante(inicio))
    }, 1000)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearInterval(id)
    }
  }, [])

  const totalMinRestante = restante.horas * 60 + restante.minutos
  const urgente = pronto && !restante.expirou && restante.horas < 1
  const corTempo = urgente ? 'text-neon-orange' : 'text-neon-cyan'

  const labelSR = restante.expirou
    ? 'oferta expirada'
    : `oferta expira em ${restante.horas} horas e ${restante.minutos} minutos`

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={labelSR}
      className="flex flex-col items-center gap-2 text-center"
    >
      <div className="inline-flex items-center gap-2 font-hud text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-400">
        <Clock className={`w-3.5 h-3.5 ${corTempo}`} aria-hidden />
        oferta de lançamento expira em
      </div>
      <div
        aria-hidden
        className={`font-hud font-bold tabular-nums text-xl md:text-2xl ${corTempo}`}
      >
        {pronto
          ? `${pad(restante.horas)}:${pad(restante.minutos)}:${pad(restante.segundos)}`
          : '--:--:--'}
      </div>
      <span className="sr-only">
        {pronto
          ? restante.expirou
            ? 'expirou'
            : `${totalMinRestante} minutos restantes`
          : ''}
      </span>
    </div>
  )
}
