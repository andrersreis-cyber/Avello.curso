export interface ItemOferta {
  texto: string
  destaque?: boolean
}

export interface Depoimento {
  id: string
  nome: string
  nivelAntes: 1 | 2 | 3 | 4
  nivelDepois: 1 | 2 | 3 | 4
  imagem: string
  destaque: string
  metrica: string
}

export interface PerguntaFAQ {
  pergunta: string
  resposta: string
}

export const PRECO_ANCORA_REAIS = 199
export const PRECO_OFERTA_REAIS = 59.99
export const PRECO_OFERTA_CENTAVOS = 5999
export const DESCONTO_PERCENT = 70
export const COUNTDOWN_HORAS = 24
export const COUNTDOWN_STORAGE_KEY = 'avello_countdown_start_v1'

export const ITENS_OFERTA: readonly ItemOferta[] = [
  { texto: 'todos os 9 módulos desbloqueados', destaque: true },
  {
    texto: 'atualizações semanais · Claude Code, Skills, MCPs, Projects, Agent SDK',
    destaque: true,
  },
  { texto: '3.500 prompts ChatGPT organizados' },
  { texto: '3.500 prompts Midjourney' },
  { texto: '3.000 templates Typebot' },
  { texto: '2.000 templates n8n (uso comercial liberado)' },
  { texto: '14 mil ferramentas IA categorizadas' },
  { texto: '350 softwares self-hosted' },
  { texto: 'GitHub de membros (acesso privado)' },
  { texto: 'infraestrutura completa' },
  { texto: 'bônus: 30 SaaS white label', destaque: true },
] as const

export const DEPOIMENTOS: readonly Depoimento[] = [
  {
    id: 'gustavo',
    nome: 'Gustavo',
    nivelAntes: 2,
    nivelDepois: 3,
    imagem: '/images/social-proof/gustavo.png',
    destaque: 'é um atalho pronto',
    metrica: 'R$ 39 → R$ 250 em 12 dias',
  },
  {
    id: 'vitoria',
    nome: 'Vitória',
    nivelAntes: 1,
    nivelDepois: 2,
    imagem: '/images/social-proof/vitoria.png',
    destaque: 'cobrei R$ 250 usando R$ 39',
    metrica: 'ROI: 6.4x · primeiro mês',
  },
  {
    id: 'matheus',
    nome: 'Matheus',
    nivelAntes: 3,
    nivelDepois: 4,
    imagem: '/images/social-proof/matheus.png',
    destaque: 'R$ 500 + R$ 300/mês de recorrência',
    metrica: 'R$ 8.100 em 90 dias',
  },
] as const

export const VIDEO_SHORT_ID = 'g9T6TSR30Tc'

export const FAQ: readonly PerguntaFAQ[] = [
  {
    pergunta: 'funciona mesmo pra quem tá começando?',
    resposta: 'sim. o arsenal é categorizado por nível. você vê só o que precisa.',
  },
  {
    pergunta: 'o que vem nas atualizações semanais?',
    resposta:
      'tudo o que sai na fronteira do Claude Code — skills novas, MCPs, Projects, hooks, sub-agents, Agent SDK. você recebe destilado, sem precisar garimpar em 20 newsletters.',
  },
  {
    pergunta: 'o que acontece depois que eu pago?',
    resposta: 'acesso imediato. login na hora. nada de esperar 24h.',
  },
  {
    pergunta: 'funciona sem saber programar?',
    resposta: 'sim. 90% do arsenal é "copia e cola". o resto tem vídeo passo a passo.',
  },
  {
    pergunta: 'posso revender o que tá dentro?',
    resposta: 'sim. uso comercial liberado.',
  },
  {
    pergunta: 'e se eu não gostar?',
    resposta: '7 dias pra testar. se não servir, devolvemos 100%. sem perguntar.',
  },
  {
    pergunta: 'preço vai subir?',
    resposta: 'sim. R$ 59,99 é preço de lançamento. sobe pra R$ 199 quando a oferta fecha.',
  },
] as const
