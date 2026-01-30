// Configuração dos módulos da plataforma
// Baseado na estrutura do sistema original

export type Module = {
  id: string
  name: string
  description: string
  icon: string
  table: string
  countField?: string
  enabled: boolean
  requiresFullAccess?: boolean // Requer 7 dias de premium para acessar
}

export const modules: Module[] = [
  {
    id: 'n8n-templates',
    name: 'Pack +2500 Templates n8n',
    description: 'Fluxos completos e prontos para usar no seu n8n',
    icon: '📦',
    table: 'n8n_workflows',
    enabled: true
  },
  {
    id: 'prompts-chatgpt',
    name: '+2400 Prompts ChatGPT',
    description: 'Prompts profissionais para ChatGPT',
    icon: '💬',
    table: 'prompts_chatgpt',
    enabled: true
  },
  {
    id: 'super-fluxos',
    name: '+58 Super Fluxos',
    description: 'Super Agentes de IA avançados',
    icon: '🚀',
    table: 'n8n_workflows',
    countField: 'super_fluxos',
    enabled: true,
    requiresFullAccess: true // Liberado após 7 dias
  },
  {
    id: 'prompts-midjourney',
    name: '+290 Prompts Midjourney',
    description: 'Prompts criativos para imagens',
    icon: '🎨',
    table: 'prompts_midjourney',
    enabled: true
  },
  {
    id: 'typebot-templates',
    name: '+500 Templates Typebot',
    description: 'Chatbots prontos para usar',
    icon: '🤖',
    table: 'typebot_templates',
    enabled: true
  },
  {
    id: 'ferramentas-ia',
    name: '+14 Mil Ferramentas IA',
    description: 'Diretório completo de ferramentas',
    icon: '🛠️',
    table: 'ferramentas',
    enabled: true
  },
  {
    id: 'self-hosted',
    name: '+350 Self-Hosted',
    description: 'Softwares para instalar no seu servidor',
    icon: '⚙️',
    table: 'ferramentas',
    countField: 'self_hosted',
    enabled: true
  },
  {
    id: 'ferramentas-gratis',
    name: '+280 Ferramentas Gratuitas',
    description: 'Sem custo para usar',
    icon: '🆓',
    table: 'ferramentas',
    countField: 'gratuitas',
    enabled: true
  },
  {
    id: 'saas',
    name: '+30 SaaS White Label',
    description: 'Softwares prontos para revender',
    icon: '⚡',
    table: 'saas',
    enabled: true,
    requiresFullAccess: true // Liberado após 7 dias
  },
  {
    id: 'bonus',
    name: '+8 Bônus Exclusivos',
    description: 'Conteúdo extra especial',
    icon: '🌟',
    table: 'bonus',
    enabled: true,
    requiresFullAccess: true // Liberado após 7 dias
  }
]

// Módulo removido (Curso N8N) não está na lista
