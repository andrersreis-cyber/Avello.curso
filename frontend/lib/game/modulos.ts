import {
  MessageSquareText,
  Image,
  Bot,
  Workflow,
  Wrench,
  Server,
  Github,
  Network,
  Boxes,
  type LucideIcon,
} from 'lucide-react'

export type Raridade = 'comum' | 'rara' | 'epica' | 'lendaria'
export type Tier = 'free' | 'premium'

export type IconeKey =
  | 'MessageSquareText'
  | 'Image'
  | 'Bot'
  | 'Workflow'
  | 'Wrench'
  | 'Server'
  | 'Github'
  | 'Network'
  | 'Boxes'

export interface Modulo {
  id: string
  nome: string
  descricao: string
  iconeKey: IconeKey
  raridade: Raridade
  tier: Tier
  ordem: number
}

export interface Contador {
  id: string
  valor: number
  sufixo: string
  duracaoMs: number
}

export const ICONES_MODULO: Record<IconeKey, LucideIcon> = {
  MessageSquareText,
  Image,
  Bot,
  Workflow,
  Wrench,
  Server,
  Github,
  Network,
  Boxes,
}

export const CONTADORES: readonly Contador[] = [
  { id: 'prompts-chatgpt',    valor: 3500,  sufixo: 'prompts ChatGPT',    duracaoMs: 1800 },
  { id: 'templates-n8n',      valor: 2000,  sufixo: 'templates n8n',      duracaoMs: 1600 },
  { id: 'prompts-midjourney', valor: 3500,  sufixo: 'prompts Midjourney', duracaoMs: 1800 },
  { id: 'templates-typebot',  valor: 3000,  sufixo: 'templates Typebot',  duracaoMs: 1600 },
  { id: 'ferramentas-ia',     valor: 14000, sufixo: 'ferramentas IA',     duracaoMs: 2400 },
] as const

export const MODULOS: readonly Modulo[] = [
  { id: 'prompts-chatgpt',    nome: 'Prompts ChatGPT',      descricao: '3500 prompts validados por categoria',        iconeKey: 'MessageSquareText', raridade: 'rara',     tier: 'premium', ordem: 1 },
  { id: 'prompts-midjourney', nome: 'Prompts Midjourney',   descricao: '3500 prompts pra imagem profissional',        iconeKey: 'Image',             raridade: 'rara',     tier: 'premium', ordem: 2 },
  { id: 'templates-typebot',  nome: 'Templates Typebot',    descricao: '3000 fluxos de chatbot prontos',              iconeKey: 'Bot',               raridade: 'epica',    tier: 'premium', ordem: 3 },
  { id: 'templates-n8n',      nome: 'Templates n8n',        descricao: '2000 automações testadas em produção',        iconeKey: 'Workflow',          raridade: 'epica',    tier: 'free',    ordem: 4 },
  { id: 'ferramentas-ia',     nome: 'Ferramentas IA',       descricao: '14 mil ferramentas categorizadas por uso',    iconeKey: 'Wrench',            raridade: 'comum',    tier: 'premium', ordem: 5 },
  { id: 'self-hosted',        nome: 'Self-Hosted',          descricao: '350 softwares pra rodar no seu servidor',     iconeKey: 'Server',            raridade: 'lendaria', tier: 'premium', ordem: 6 },
  { id: 'github-membros',     nome: 'GitHub de Membros',    descricao: 'acesso privado ao repo de operadores',        iconeKey: 'Github',            raridade: 'lendaria', tier: 'premium', ordem: 7 },
  { id: 'infraestrutura',     nome: 'Infraestrutura',       descricao: 'setup de SaaS white label pronto pra clonar', iconeKey: 'Network',           raridade: 'lendaria', tier: 'premium', ordem: 8 },
  { id: 'saas-white-label',   nome: '30 SaaS White Label',  descricao: 'aplicações prontas pra revender no seu nome', iconeKey: 'Boxes',             raridade: 'lendaria', tier: 'premium', ordem: 9 },
] as const
