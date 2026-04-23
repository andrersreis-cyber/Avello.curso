'use client'

import Image from 'next/image'
import { useState } from 'react'

interface AvatarAgente0Props {
  size: number
  className?: string
  priority?: boolean
}

/**
 * Avatar do Agente 0. Tenta carregar a imagem real em /images/agente-0.jpg.
 * Se falhar (arquivo ainda não salvo), mostra um SVG placeholder com uma
 * máscara angular minimalista que combina com o tema.
 */
export function AvatarAgente0({ size, className = '', priority = false }: AvatarAgente0Props) {
  const [erro, setErro] = useState(false)

  if (erro) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 ${className}`}
        style={{ width: size, height: size }}
        aria-label="agente 0"
      >
        <svg
          viewBox="0 0 120 120"
          width={size * 0.7}
          height={size * 0.7}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {/* capuz */}
          <path d="M20 50 Q20 20 60 20 Q100 20 100 50 L100 95 Q80 108 60 108 Q40 108 20 95 Z" fill="#0a0a0b" stroke="#18181b" strokeWidth="1.5" />
          {/* máscara */}
          <polygon points="40,40 60,32 80,40 82,65 60,78 38,65" fill="#1a1a1d" stroke="#27272a" strokeWidth="1.2" />
          {/* olhos */}
          <polygon points="46,52 54,50 52,58 46,58" fill="#06b6d4" opacity="0.85" />
          <polygon points="74,50 66,52 68,58 74,58" fill="#06b6d4" opacity="0.85" />
          {/* linha central máscara */}
          <line x1="60" y1="38" x2="60" y2="72" stroke="#27272a" strokeWidth="0.8" />
        </svg>
      </div>
    )
  }

  return (
    <Image
      src="/images/agente-0.jpg"
      alt="agente 0"
      width={size}
      height={size}
      priority={priority}
      onError={() => setErro(true)}
      className={`object-cover ${className}`}
    />
  )
}
