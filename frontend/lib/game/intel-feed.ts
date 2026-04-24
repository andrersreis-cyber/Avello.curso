/**
 * Central de Intel — feed de transmissões semanais.
 * Últimas atualizações cobrem Claude Code, Skills, MCPs, Projects, Agent SDK.
 * Atualizar manualmente conforme novos releases saem.
 */

export type TipoTransmissao =
  | 'novo'
  | 'update'
  | 'marketplace'
  | 'api'
  | 'release'

export interface Transmissao {
  data: string
  tipo: TipoTransmissao
  texto: string
}

export const TRANSMISSOES: Transmissao[] = [
  { data: '24.abr', tipo: 'novo', texto: 'novo módulo: /loop e /schedule — tasks recorrentes' },
  { data: '17.abr', tipo: 'marketplace', texto: 'marketplace de skills expandido · +50 agentes' },
  { data: '10.abr', tipo: 'api', texto: 'computer use API · Claude 4.5 release' },
  { data: '03.abr', tipo: 'release', texto: 'hooks + sub-agents desbloqueados' },
  { data: '27.mar', tipo: 'update', texto: 'MCPs oficiais (github, linear, notion)' },
]

export const PROXIMA_TRANSMISSAO_DIAS = 3

export const TIPOS_LABEL: Record<TipoTransmissao, string> = {
  novo: 'novo',
  update: 'update',
  marketplace: 'market',
  api: 'api',
  release: 'release',
}
