'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, X } from 'lucide-react'

interface VideoShortProps {
  videoId: string
  titulo?: string
}

export function VideoShort({ videoId, titulo = 'vídeo do operador' }: VideoShortProps) {
  const [aberto, setAberto] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  const abrir = useCallback(() => setAberto(true), [])
  const fechar = useCallback(() => setAberto(false), [])

  useEffect(() => {
    if (!aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const triggerAoAbrir = triggerRef.current
    closeBtnRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      triggerAoAbrir?.focus()
    }
  }, [aberto, fechar])

  const [thumbnail, setThumbnail] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
  )
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`

  const handleThumbError = useCallback(() => {
    setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`)
  }, [videoId])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={abrir}
        aria-label={`reproduzir ${titulo}`}
        className="group relative mx-auto block w-full max-w-[280px] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        style={{ aspectRatio: '9 / 16' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt=""
          loading="lazy"
          onError={handleThumbError}
          className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-neon-cyan/90 flex items-center justify-center shadow-[0_0_32px_rgba(6,182,212,0.55)] group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-zinc-950 fill-zinc-950 ml-1" aria-hidden />
          </div>
        </div>
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={titulo}
          onClick={fechar}
          className="fixed inset-0 z-[60] bg-zinc-950/95 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[400px]"
            style={{ aspectRatio: '9 / 16' }}
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={fechar}
              aria-label="fechar vídeo"
              className="absolute -top-12 right-0 text-zinc-300 hover:text-neon-cyan transition-colors p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan rounded-md"
            >
              <X className="w-6 h-6" aria-hidden />
            </button>
            <iframe
              src={embedUrl}
              title={titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full rounded-xl border border-zinc-800"
            />
          </div>
        </div>
      )}
    </>
  )
}
