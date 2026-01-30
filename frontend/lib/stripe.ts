import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js'

// Cliente Stripe para o navegador
let stripePromise: Promise<StripeClient | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// IDs dos preços no Stripe (criados via script)
export const STRIPE_PRICE_IDS = {
  lowtik: 'price_1Sv50RHFr5u9PsVJJkc1AV1O',
  consultoria: 'price_1Sv50SHFr5u9PsVJLJbKqfmR',
  setup_n8n: 'price_1Sv50SHFr5u9PsVJce95MAwD',
  pack_premium: 'price_1Sv50THFr5u9PsVJEFZ6OTfk',
  acesso_vitalicio: 'price_1Sv50UHFr5u9PsVJbJ22A6Rw',
  mentoria_mensal: 'price_1Sv50UHFr5u9PsVJFU5wdeEx',
}

// Tipos de produtos
export type ProductType = 'subscription' | 'one_time'

// Produtos disponíveis
export const products = {
  // Assinatura principal
  lowtik: {
    id: 'lowtik',
    name: 'Acesso Anual',
    description: 'Acesso completo ao sistema por 12 meses. Todos os templates, prompts, ferramentas e bônus inclusos.',
    price: 3900, // em centavos (R$ 39,00)
    currency: 'brl',
    type: 'subscription' as ProductType,
    interval: 'year' as const,
    features: [
      '+2000 Templates n8n',
      '+3500 Prompts ChatGPT',
      '+3500 Prompts Midjourney',
      '+3000 Templates Typebot',
      '+14 Mil Ferramentas IA',
      '+350 Self-Hosted',
      '+30 SaaS White Label',
      '+8 Bônus Exclusivos',
      'Comunidade no Telegram',
      'Atualizações por 12 meses',
    ],
    highlight: true,
  },
  
  // Serviços adicionais
  consultoria: {
    id: 'consultoria',
    name: 'Consultoria 1h',
    description: 'Sessão individual de 1 hora para tirar dúvidas, revisar automações ou receber orientação personalizada.',
    price: 29700, // R$ 297,00
    currency: 'brl',
    type: 'one_time' as ProductType,
    features: [
      '1 hora de consultoria',
      'Videoconferência ao vivo',
      'Análise de automações',
      'Recomendações personalizadas',
      'Gravação da sessão',
    ],
  },
  
  setup_n8n: {
    id: 'setup_n8n',
    name: 'Setup n8n Completo',
    description: 'Instalação e configuração completa do n8n no seu servidor com SSL, backup e monitoramento.',
    price: 49700, // R$ 497,00
    currency: 'brl',
    type: 'one_time' as ProductType,
    features: [
      'Instalação em VPS/servidor',
      'Configuração de SSL',
      'Setup de backup automático',
      'Configuração de domínio',
      'Monitoramento básico',
      '30 dias de suporte',
    ],
  },
  
  pack_premium: {
    id: 'pack_premium',
    name: 'Pack Templates Premium',
    description: 'Coleção exclusiva de templates avançados não disponíveis no plano padrão.',
    price: 9700, // R$ 97,00
    currency: 'brl',
    type: 'one_time' as ProductType,
    features: [
      '50 templates exclusivos',
      'Automações avançadas',
      'Integrações premium',
      'Documentação detalhada',
      'Suporte por email',
    ],
  },
  
  acesso_vitalicio: {
    id: 'acesso_vitalicio',
    name: 'Acesso Vitalício Premium',
    description: 'Acesso permanente ao sistema com todas as atualizações futuras incluídas para sempre.',
    price: 99700, // R$ 997,00
    currency: 'brl',
    type: 'one_time' as ProductType,
    features: [
      'Acesso vitalício',
      'Todas as atualizações',
      'Novos módulos inclusos',
      'Suporte prioritário',
      'Badge VIP na comunidade',
    ],
    highlight: true,
  },
  
  mentoria_mensal: {
    id: 'mentoria_mensal',
    name: 'Mentoria Mensal',
    description: 'Acompanhamento mensal com reuniões semanais e suporte contínuo para seus projetos.',
    price: 19700, // R$ 197,00/mês
    currency: 'brl',
    type: 'subscription' as ProductType,
    interval: 'month' as const,
    features: [
      '4 reuniões por mês',
      'Suporte via WhatsApp',
      'Revisão de projetos',
      'Acesso a recursos extras',
      'Networking exclusivo',
    ],
  },
}

export type ProductId = keyof typeof products
