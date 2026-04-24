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
  nomeOperador: string | null
  xpTotal: number
  itensColetados: string[]
  hydrated: boolean

  avancarPara: (ato: Ato) => void
  responderQuiz: (respostas: RespostasQuiz) => void
  atenderLigacao: () => void
  toggleSom: () => void
  adicionarConquista: (id: string) => void
  setNome: (nome: string | null) => void
  adicionarXp: (xp: number) => void
  coletarItem: (moduloId: string) => void
  resetColeta: () => void
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
  | 'nomeOperador'
  | 'xpTotal'
  | 'itensColetados'
> = {
  atoAtual: 1,
  progresso: PROGRESSO_POR_ATO[1],
  nivel: null,
  classe: null,
  respostasQuiz: null,
  somAtivo: false,
  ligacaoAtendida: false,
  conquistas: [],
  nomeOperador: null,
  xpTotal: 0,
  itensColetados: [],
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
        set((s) => ({
          respostasQuiz: respostas,
          nivel: perfil.nivel,
          classe: perfil.classe,
          xpTotal: s.xpTotal + 300,
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

      setNome: (nome) =>
        set(() => ({
          nomeOperador: nome ? nome.trim().slice(0, 24) : null,
        })),

      adicionarXp: (xp) =>
        set((s) => ({
          xpTotal: Math.max(0, s.xpTotal + xp),
        })),

      coletarItem: (moduloId) =>
        set((s) =>
          s.itensColetados.includes(moduloId)
            ? s
            : {
                itensColetados: [...s.itensColetados, moduloId],
                xpTotal: s.xpTotal + 50,
              },
        ),

      resetColeta: () =>
        set(() => ({
          itensColetados: [],
        })),

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
        nomeOperador: s.nomeOperador,
        xpTotal: s.xpTotal,
        itensColetados: s.itensColetados,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    },
  ),
)
