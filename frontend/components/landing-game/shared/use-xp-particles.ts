'use client'

import { useCallback, useState } from 'react'
import type { XpEvent } from './xp-particle'

/**
 * Hook que gerencia uma fila de eventos XP.
 * O consumidor chama `disparar(valor, origemEl)` com o elemento de origem
 * da partícula — a função pega as coordenadas do `getBoundingClientRect`.
 */
export function useXpParticles() {
  const [eventos, setEventos] = useState<XpEvent[]>([])

  const dispararXp = useCallback(
    (valor: number, origem?: { x: number; y: number } | HTMLElement | null) => {
      let x = typeof window !== 'undefined' ? window.innerWidth / 2 : 0
      let y = typeof window !== 'undefined' ? window.innerHeight / 2 : 0

      if (origem) {
        if (origem instanceof HTMLElement) {
          const rect = origem.getBoundingClientRect()
          x = rect.left + rect.width / 2
          y = rect.top + rect.height / 2
        } else {
          x = origem.x
          y = origem.y
        }
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setEventos((lista) => [...lista, { id, valor, origemX: x, origemY: y }])
    },
    [],
  )

  const removerEvento = useCallback((id: string) => {
    setEventos((lista) => lista.filter((e) => e.id !== id))
  }, [])

  return { eventos, dispararXp, removerEvento }
}
