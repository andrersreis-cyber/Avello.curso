'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { AvatarOperador } from './avatar-operador'
import type { OperadorRanking } from '@/lib/game/leaderboard'

interface ModalProvaProps {
  operador: OperadorRanking
  onClose: () => void
}

export function ModalProva({ operador, onClose }: ModalProvaProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  const isVideo = operador.provaTipo === 'video'
  const src = operador.provaSrc ?? ''

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-prova-titulo"
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-zinc-950/92 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-cyan-500/30 bg-zinc-900 shadow-[0_0_80px_rgba(6,182,212,0.2)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3 bg-zinc-950/80">
          <div className="flex items-center gap-3 min-w-0">
            <AvatarOperador nome={operador.nome} nivel={operador.nivel} size={40} />
            <div className="min-w-0">
              <h3
                id="modal-prova-titulo"
                className="font-orbitron font-semibold text-sm text-zinc-50 truncate"
              >
                {operador.nome}
              </h3>
              <p className="font-hud text-[10px] uppercase tracking-[0.15em] text-neon-cyan">
                rank #{operador.posicao} · nv {operador.nivel}
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="fechar"
            className="text-zinc-400 hover:text-neon-cyan transition-colors p-1.5 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          <p className="text-sm text-zinc-300 font-exo2 mb-4 leading-snug">
            <span className="text-neon-cyan">conquista:</span> {operador.conquista}
          </p>

          {isVideo ? (
            <div
              className="relative w-full mx-auto rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950"
              style={{ aspectRatio: '9 / 16', maxWidth: 280 }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${src}?autoplay=1&rel=0`}
                title={`vídeo de ${operador.nome}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="relative w-full mx-auto rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
              <Image
                src={src}
                alt={`prova whatsapp de ${operador.nome}`}
                width={720}
                height={1280}
                className="w-full h-auto"
                sizes="(max-width: 640px) 100vw, 480px"
              />
            </div>
          )}

          <p className="mt-4 text-center font-hud text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            transmissão interceptada · conteúdo original
          </p>
        </div>
      </div>
    </div>
  )
}
