'use client'

interface AvatarOperadorProps {
  nome: string
  nivel: 1 | 2 | 3 | 4
  size?: number
  className?: string
}

// Avatar gerado: pega iniciais + cor baseada no nível
const COR_POR_NIVEL: Record<1 | 2 | 3 | 4, { bg: string; text: string; glow: string }> = {
  1: { bg: '#1e3a8a', text: '#93c5fd', glow: 'rgba(59,130,246,0.35)' },
  2: { bg: '#164e63', text: '#67e8f9', glow: 'rgba(6,182,212,0.4)' },
  3: { bg: '#581c87', text: '#d8b4fe', glow: 'rgba(168,85,247,0.4)' },
  4: { bg: '#14532d', text: '#86efac', glow: 'rgba(34,197,94,0.4)' },
}

export function AvatarOperador({ nome, nivel, size = 48, className = '' }: AvatarOperadorProps) {
  const iniciais = nome
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const cor = COR_POR_NIVEL[nivel]

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full border-2 border-zinc-700 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        background: cor.bg,
        boxShadow: `0 0 18px ${cor.glow}`,
      }}
      aria-label={`avatar de ${nome}, nível ${nivel}`}
    >
      {/* Scanline sutil */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 3px)',
        }}
      />
      <span
        className="relative font-orbitron font-bold tabular-nums"
        style={{
          color: cor.text,
          fontSize: size * 0.38,
          letterSpacing: '-0.02em',
        }}
      >
        {iniciais}
      </span>
      {/* Dot status (online) */}
      <span
        aria-hidden
        className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900"
        style={{
          boxShadow: '0 0 8px rgba(34,197,94,0.8)',
        }}
      />
    </div>
  )
}
