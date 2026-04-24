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
  { id: 'prompts-chatgpt',    nome: 'Prompts ChatGPT',      descricao: '3500 prompts validados por categoria',        iconeKey: 'MessageSquareText', raridade: 'rara',     ordem: 1 },
  { id: 'prompts-midjourney', nome: 'Prompts Midjourney',   descricao: '3500 prompts pra imagem profissional',        iconeKey: 'Image',             raridade: 'rara',     ordem: 2 },
  { id: 'templates-typebot',  nome: 'Templates Typebot',    descricao: '3000 fluxos de chatbot prontos',              iconeKey: 'Bot',               raridade: 'epica',    ordem: 3 },
  { id: 'templates-n8n',      nome: 'Templates n8n',        descricao: '2000 automações testadas em produção',        iconeKey: 'Workflow',          raridade: 'epica',    ordem: 4 },
  { id: 'ferramentas-ia',     nome: 'Ferramentas IA',       descricao: '14 mil ferramentas categorizadas por uso',    iconeKey: 'Wrench',            raridade: 'comum',    ordem: 5 },
  { id: 'self-hosted',        nome: 'Self-Hosted',          descricao: '350 softwares pra rodar no seu servidor',     iconeKey: 'Server',            raridade: 'lendaria', ordem: 6 },
  { id: 'github-membros',     nome: 'GitHub de Membros',    descricao: 'acesso privado ao repo de operadores',        iconeKey: 'Github',            raridade: 'lendaria', ordem: 7 },
  { id: 'infraestrutura',     nome: 'Infraestrutura',       descricao: 'setup de SaaS white label pronto pra clonar', iconeKey: 'Network',           raridade: 'lendaria', ordem: 8 },
  { id: 'saas-white-label',   nome: '30 SaaS White Label',  descricao: 'aplicações prontas pra revender no seu nome', iconeKey: 'Boxes',             raridade: 'lendaria', ordem: 9 },
] as const
