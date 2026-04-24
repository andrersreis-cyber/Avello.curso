export type Nivel = 1 | 2 | 3 | 4
export type ClasseNivel = 'Iniciante' | 'Aspirante' | 'Freelancer' | 'Operador'
export type RespostasQuiz = [number, number, number]

export interface PerfilNivel {
  nivel: Nivel
  classe: ClasseNivel
}

/**
 * Converte o trio de respostas (cada uma 1–4) em um nível do operador.
 * Soma 3–4 = Iniciante · 5–7 = Aspirante · 8–10 = Freelancer · 11–12 = Operador.
 */
export function calcularNivel(respostas: RespostasQuiz): PerfilNivel {
  const soma = respostas[0] + respostas[1] + respostas[2]

  if (soma <= 4) return { nivel: 1, classe: 'Iniciante' }
  if (soma <= 7) return { nivel: 2, classe: 'Aspirante' }
  if (soma <= 10) return { nivel: 3, classe: 'Freelancer' }
  return { nivel: 4, classe: 'Operador' }
}

export interface PerguntaQuiz {
  id: 'experiencia' | 'renda' | 'meta'
  titulo: string
  opcoes: { texto: string; peso: 1 | 2 | 3 | 4 }[]
}

export const PERGUNTAS_QUIZ: readonly PerguntaQuiz[] = [
  {
    id: 'experiencia',
    titulo: 'você já mexeu com ia pra trabalhar?',
    opcoes: [
      { texto: 'nunca, só brinquei no chatgpt', peso: 1 },
      { texto: 'já usei, mas nada sério', peso: 2 },
      { texto: 'uso toda semana', peso: 3 },
      { texto: 'vivo disso', peso: 4 },
    ],
  },
  {
    id: 'renda',
    titulo: 'quanto você fatura hoje com ia ou automação?',
    opcoes: [
      { texto: 'zero, quero começar', peso: 1 },
      { texto: 'até R$ 2k/mês', peso: 2 },
      { texto: 'entre R$ 2k e R$ 10k/mês', peso: 3 },
      { texto: 'acima de R$ 10k/mês', peso: 4 },
    ],
  },
  {
    id: 'meta',
    titulo: 'o que você quer destravar primeiro?',
    opcoes: [
      { texto: 'minha primeira venda com ia', peso: 1 },
      { texto: 'sair do freela e virar recorrência', peso: 2 },
      { texto: 'escalar o que já faço', peso: 3 },
      { texto: 'criar meu próprio saas', peso: 4 },
    ],
  },
] as const
