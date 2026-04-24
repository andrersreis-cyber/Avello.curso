'use client'

import { useEffect, useState } from 'react'

interface GlitchTextProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'span'
  className?: string
}

/**
 * Aplica o efeito glitch uma única vez ao montar. Respeita reduced-motion
 * desativando a animação via CSS (classe `.glitch-once` já tem o guard).
 */
export function GlitchText({
  children,
  as: Tag = 'h1',
  className = '',
}: GlitchTextProps) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setActive(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <Tag className={`${className} ${active ? 'glitch-once' : ''}`}>
      {children}
    </Tag>
  )
}
