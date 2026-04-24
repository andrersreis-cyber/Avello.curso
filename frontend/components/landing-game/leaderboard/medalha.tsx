'use client'

import type { MedalhaTier } from '@/lib/game/leaderboard'

interface MedalhaProps {
  tier: MedalhaTier
  posicao: number
  className?: string
}

const TIER_CONFIG: Record<
  Exclude<MedalhaTier, 'sem'>,
  { fill: string; stroke: string; ring: string; glow: string; label: string }
> = {
  ouro: {
    fill: '#fbbf24',
    stroke: '#f59e0b',
    ring: 'ring-amber-400/60',
    glow: 'drop-shadow-[0_0_24px_rgba(251,191,36,0.7)]',
    label: '1º lugar · medalha de ouro',
  },
  prata: {
    fill: '#e4e4e7',
    stroke: '#a1a1aa',
    ring: 'ring-zinc-300/50',
    glow: 'drop-shadow-[0_0_18px_rgba(228,228,231,0.55)]',
    label: '2º lugar · medalha de prata',
  },
  bronze: {
    fill: '#d97706',
    stroke: '#b45309',
    ring: 'ring-amber-700/50',
    glow: 'drop-shadow-[0_0_16px_rgba(180,83,9,0.55)]',
    label: '3º lugar · medalha de bronze',
  },
}

export function Medalha({ tier, posicao, className = '' }: MedalhaProps) {
  if (tier === 'sem') {
    return (
      <span
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full border border-zinc-700 bg-zinc-900 font-orbitron font-bold text-sm text-zinc-400 ${className}`}
        aria-label={`posição ${posicao}`}
      >
        {posicao}
      </span>
    )
  }

  const cfg = TIER_CONFIG[tier]

  return (
    <div
      className={`relative inline-flex items-center justify-center ${cfg.glow} ${className}`}
      aria-label={cfg.label}
    >
      <svg
        width="56"
        height="64"
        viewBox="0 0 56 64"
        fill="none"
        aria-hidden
        className="block"
      >
        {/* Fita lateral esquerda */}
        <path d="M16 2 L8 28 L14 30 L22 8 Z" fill="#dc2626" opacity="0.85" />
        {/* Fita lateral direita */}
        <path d="M40 2 L48 28 L42 30 L34 8 Z" fill="#dc2626" opacity="0.85" />
        {/* Círculo da medalha */}
        <circle cx="28" cy="40" r="20" fill={cfg.fill} stroke={cfg.stroke} strokeWidth="2.5" />
        <circle cx="28" cy="40" r="15" fill="none" stroke={cfg.stroke} strokeWidth="1" opacity="0.5" />
        {/* Número da posição */}
        <text
          x="28"
          y="46"
          textAnchor="middle"
          fontFamily="Orbitron, sans-serif"
          fontSize="18"
          fontWeight="700"
          fill="#18181b"
        >
          {posicao}
        </text>
      </svg>
    </div>
  )
}
