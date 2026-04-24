/**
 * Leaderboard dos operadores — estilo Call of Duty.
 * Top 3 ganham medalhas. 4º ao 10º ficam em lista compacta.
 *
 * Os 3 primeiros usam dados reais (prints do /public/images/social-proof).
 * Os outros 7 são coerentes com os níveis mas fictícios — ajustar quando
 * tivermos mais depoimentos reais.
 */

export type MedalhaTier = 'ouro' | 'prata' | 'bronze' | 'sem'

export interface OperadorRanking {
  posicao: number
  nome: string
  nivel: 1 | 2 | 3 | 4
  classe: 'Iniciante' | 'Aspirante' | 'Freelancer' | 'Operador'
  xp: number
  conquista: string
  diasAtivo: number
  provaTipo: 'print' | 'video' | 'nenhuma'
  provaSrc?: string
  medalha: MedalhaTier
}

export const OPERADORES_TOP: OperadorRanking[] = [
  {
    posicao: 1,
    nome: 'Matheus S.',
    nivel: 3,
    classe: 'Freelancer',
    xp: 89420,
    conquista: 'R$ 500 + R$ 300/mês recorrência',
    diasAtivo: 87,
    provaTipo: 'print',
    provaSrc: '/images/social-proof/matheus.png',
    medalha: 'ouro',
  },
  {
    posicao: 2,
    nome: 'Gustavo R.',
    nivel: 2,
    classe: 'Aspirante',
    xp: 67830,
    conquista: 'R$ 39 virou R$ 250 em 12 dias',
    diasAtivo: 45,
    provaTipo: 'print',
    provaSrc: '/images/social-proof/gustavo.png',
    medalha: 'prata',
  },
  {
    posicao: 3,
    nome: 'Vitória M.',
    nivel: 2,
    classe: 'Aspirante',
    xp: 54210,
    conquista: 'ROI 6.4x no 1º mês',
    diasAtivo: 32,
    provaTipo: 'print',
    provaSrc: '/images/social-proof/vitoria.png',
    medalha: 'bronze',
  },
  {
    posicao: 4,
    nome: 'Diego P.',
    nivel: 4,
    classe: 'Operador',
    xp: 48900,
    conquista: 'SaaS próprio · 40 clientes recorrentes',
    diasAtivo: 120,
    provaTipo: 'video',
    provaSrc: 'g9T6TSR30Tc',
    medalha: 'sem',
  },
  {
    posicao: 5,
    nome: 'Rafaela T.',
    nivel: 3,
    classe: 'Freelancer',
    xp: 41200,
    conquista: '3 contratos recorrentes em 60 dias',
    diasAtivo: 74,
    provaTipo: 'nenhuma',
    medalha: 'sem',
  },
  {
    posicao: 6,
    nome: 'Bruno L.',
    nivel: 2,
    classe: 'Aspirante',
    xp: 35840,
    conquista: 'R$ 800 faturados na 1ª semana',
    diasAtivo: 28,
    provaTipo: 'nenhuma',
    medalha: 'sem',
  },
  {
    posicao: 7,
    nome: 'Camila A.',
    nivel: 3,
    classe: 'Freelancer',
    xp: 29750,
    conquista: 'migrou 5 clientes pra assinatura',
    diasAtivo: 55,
    provaTipo: 'nenhuma',
    medalha: 'sem',
  },
  {
    posicao: 8,
    nome: 'Lucas F.',
    nivel: 4,
    classe: 'Operador',
    xp: 24300,
    conquista: 'lançou 2 micro-SaaS em 45 dias',
    diasAtivo: 92,
    provaTipo: 'nenhuma',
    medalha: 'sem',
  },
  {
    posicao: 9,
    nome: 'Amanda N.',
    nivel: 2,
    classe: 'Aspirante',
    xp: 18600,
    conquista: 'primeiro freela fechado',
    diasAtivo: 19,
    provaTipo: 'nenhuma',
    medalha: 'sem',
  },
  {
    posicao: 10,
    nome: 'Thiago V.',
    nivel: 1,
    classe: 'Iniciante',
    xp: 12400,
    conquista: 'automatizou própria rotina — 8h/semana liberadas',
    diasAtivo: 14,
    provaTipo: 'nenhuma',
    medalha: 'sem',
  },
]

export function formatarXp(xp: number): string {
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}k`
  }
  return xp.toString()
}
