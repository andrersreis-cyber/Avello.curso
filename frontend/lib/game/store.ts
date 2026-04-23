'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ClasseNivel, Nivel, RespostasQuiz } from './levels'
import { calcularNivel } from './levels'

export type Ato = 0 | 1 | 2 | 3 | 4 | 5

interface GameState {
  atoAtual: Ato
  progresso: number
  nivel: Nivel | null
  classe: ClasseNivel | null
  respostasQuiz: RespostasQuiz | null
  somAtivo: boolean
  ligacaoAtendida: boolean
  conquistas: string[]
  hydrated: boolean

  avancarPara: (ato: Ato) => void
  responderQuiz: (respostas: RespostasQuiz) => void
  atenderLigacao: () => void
  toggleSom: () => void
  adicionarConquista: (id: string) => void
  resetJogo: () => void
  setHydrated: () => void
}

const PROGRESSO_POR_ATO: Record<Ato, number> = {
  0: 0,
  1: 10,
  2: 30,
  3: 55,
  4: 80,
  5: 100,
}

const INITIAL: Pick<
  GameState,
  | 'atoAtual'
  | 'progresso'
  | 'nivel'
  | 'classe'
  | 'respostasQuiz'
  | 'somAtivo'
  | 'ligacaoAtendida'
  | 'conquistas'
> = {
  atoAtual: 1,
  progresso: PROGRESSO_POR_ATO[1],
  nivel: null,
  classe: null,
  respostasQuiz: null,
  somAtivo: false,
  ligacaoAtendida: false,
  conquistas: [],
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...INITIAL,
      hydrated: false,

      avancarPara: (ato) =>
        set(() => ({
          atoAtual: ato,
          progresso: PROGRESSO_POR_ATO[ato],
        })),

      responderQuiz: (respostas) => {
        const perfil = calcularNivel(respostas)
        set(() => ({
          respostasQuiz: respostas,
          nivel: perfil.nivel,
          classe: perfil.classe,
        }))
      },

      atenderLigacao: () => set(() => ({ ligacaoAtendida: true })),

      toggleSom: () => set((s) => ({ somAtivo: !s.somAtivo })),

      adicionarConquista: (id) =>
        set((s) =>
          s.conquistas.includes(id)
            ? s
            : { conquistas: [...s.conquistas, id] },
        ),

      resetJogo: () => set(() => ({ ...INITIAL })),

      setHydrated: () => set(() => ({ hydrated: true })),
    }),
    {
      name: 'avello-game-v1',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? window.sessionStorage : (undefined as unknown as Storage),
      ),
      partialize: (s) => ({
        atoAtual: s.atoAtual,
        progresso: s.progresso,
        nivel: s.nivel,
        classe: s.classe,
        respostasQuiz: s.respostasQuiz,
        somAtivo: s.somAtivo,
        ligacaoAtendida: s.ligacaoAtendida,
        conquistas: s.conquistas,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    },
  ),
)
