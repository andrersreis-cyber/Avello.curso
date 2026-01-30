// Dicionário de tradução de nodes n8n para português
const nodeTranslations: Record<string, string> = {
  // Triggers
  'webhook': 'Webhook',
  'manualTrigger': 'Gatilho Manual',
  'scheduleTrigger': 'Agendamento',
  'formTrigger': 'Formulário',
  'emailTrigger': 'Gatilho de Email',
  
  // Actions
  'httpRequest': 'Requisição HTTP',
  'set': 'Definir Dados',
  'code': 'Código JavaScript',
  'function': 'Função',
  'if': 'Condição Se/Então',
  'switch': 'Múltiplas Condições',
  'merge': 'Mesclar Dados',
  'filter': 'Filtrar',
  'splitInBatches': 'Dividir em Lotes',
  'noOp': 'Sem Operação',
  'stopAndError': 'Parar com Erro',
  'respondToWebhook': 'Responder Webhook',
  
  // AI
  'openAi': 'OpenAI / ChatGPT',
  'agent': 'Agente IA',
  'chainRetrievalQa': 'RAG / Perguntas',
  'memoryPostgresChatMemory': 'Memória Postgres',
  'vectorStoreQdrant': 'Banco Vetorial Qdrant',
  'textSplitterTokenSplitter': 'Dividir Texto',
  'textSplitterRecursiveCharacterTextSplitter': 'Dividir Texto Recursivo',
  'toolHttpRequest': 'Ferramenta HTTP para IA',
  
  // Social Media
  'telegram': 'Telegram',
  'slack': 'Slack',
  'discord': 'Discord',
  'twitter': 'Twitter/X',
  'instagram': 'Instagram',
  'facebook': 'Facebook',
  'linkedIn': 'LinkedIn',
  'tiktok': 'TikTok',
  'youtube': 'YouTube',
  
  // Productivity
  'googleSheets': 'Google Planilhas',
  'googleDrive': 'Google Drive',
  'gmail': 'Gmail',
  'notion': 'Notion',
  'airtable': 'Airtable',
  'trello': 'Trello',
  'todoist': 'Todoist',
  'asana': 'Asana',
  
  // CRM & Sales
  'hubspot': 'HubSpot',
  'salesforce': 'Salesforce',
  'pipedrive': 'Pipedrive',
  'zohocrm': 'Zoho CRM',
  
  // E-commerce
  'wooCommerce': 'WooCommerce',
  'shopify': 'Shopify',
  'stripe': 'Stripe',
  
  // Communication
  'whatsapp': 'WhatsApp',
  'sendGrid': 'SendGrid',
  'mailchimp': 'Mailchimp',
  'microsoftOutlook': 'Outlook',
  
  // Database
  'postgres': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'supabase': 'Supabase',
  
  // Files
  'readPDF': 'Ler PDF',
  'readWriteFile': 'Ler/Escrever Arquivo',
  'convertToFile': 'Converter para Arquivo',
  'spreadsheetFile': 'Planilha',
  
  // Utils
  'dateTime': 'Data e Hora',
  'crypto': 'Criptografia',
  'html': 'HTML',
  'markdown': 'Markdown',
  'xml': 'XML',
  'graphql': 'GraphQL',
  
  // Other
  'stickyNote': 'Nota Adesiva',
  'wordpress': 'WordPress',
  'jira': 'Jira',
  'github': 'GitHub',
  'gitlab': 'GitLab',
}

// Categorias de uso baseadas nos nodes
const useCasePatterns: { pattern: string[], category: string, description: string }[] = [
  {
    pattern: ['whatsapp', 'agent', 'openAi'],
    category: 'Chatbot WhatsApp',
    description: 'Chatbot inteligente para WhatsApp com IA'
  },
  {
    pattern: ['telegram', 'agent'],
    category: 'Bot Telegram',
    description: 'Bot automatizado para Telegram'
  },
  {
    pattern: ['webhook', 'openAi', 'respondToWebhook'],
    category: 'API com IA',
    description: 'API que processa dados usando Inteligência Artificial'
  },
  {
    pattern: ['googleSheets', 'httpRequest'],
    category: 'Automação de Planilhas',
    description: 'Integração automatizada com Google Planilhas'
  },
  {
    pattern: ['wooCommerce', 'slack'],
    category: 'E-commerce + Notificações',
    description: 'Notificações de vendas WooCommerce no Slack'
  },
  {
    pattern: ['instagram', 'airtable'],
    category: 'Marketing Instagram',
    description: 'Automação de conteúdo para Instagram'
  },
  {
    pattern: ['youtube', 'facebook'],
    category: 'Cross-posting Redes Sociais',
    description: 'Publicação automática em múltiplas redes'
  },
  {
    pattern: ['notion', 'slack'],
    category: 'Produtividade',
    description: 'Integração entre Notion e Slack'
  },
  {
    pattern: ['vectorStore', 'agent'],
    category: 'RAG / Base de Conhecimento',
    description: 'Agente IA com busca em documentos'
  },
  {
    pattern: ['scheduleTrigger', 'httpRequest'],
    category: 'Monitoramento',
    description: 'Monitoramento agendado de APIs/Sites'
  },
  {
    pattern: ['formTrigger'],
    category: 'Processamento de Formulários',
    description: 'Automação baseada em envio de formulários'
  },
  {
    pattern: ['email', 'openAi'],
    category: 'Email com IA',
    description: 'Processamento inteligente de emails'
  },
  {
    pattern: ['wordpress'],
    category: 'Automação WordPress',
    description: 'Publicação e gestão de conteúdo WordPress'
  },
]

export type WorkflowAnalysis = {
  titlePt: string
  descriptionPt: string
  category: string
  nodes: { name: string, namePt: string, type: string, typePt: string }[]
  integrations: string[]
  nodeCount: number
  connectionCount: number
  size: string
  triggers: string[]
  hasAI: boolean
}

export function analyzeWorkflow(jsonData: any, originalTitle: string): WorkflowAnalysis {
  if (!jsonData || typeof jsonData !== 'object') {
    return {
      titlePt: originalTitle,
      descriptionPt: 'Workflow de automação n8n',
      category: 'Automação',
      nodes: [],
      integrations: [],
      nodeCount: 0,
      connectionCount: 0,
      size: '0B',
      triggers: [],
      hasAI: false
    }
  }

  const nodes = jsonData.nodes || []
  const connections = jsonData.connections || {}
  
  // Extrair tipos de nodes
  const nodeTypes = nodes.map((n: any) => {
    const type = String(n.type || '').replace('n8n-nodes-base.', '').replace('@n8n/n8n-nodes-langchain.', '')
    return type.toLowerCase()
  })

  // Detectar categoria baseada nos nodes
  let category = 'Automação Geral'
  let descriptionPt = 'Workflow de automação n8n'
  
  for (const useCase of useCasePatterns) {
    const matches = useCase.pattern.filter(p => 
      nodeTypes.some((t: string) => t.includes(p.toLowerCase()))
    )
    if (matches.length >= Math.min(2, useCase.pattern.length)) {
      category = useCase.category
      descriptionPt = useCase.description
      break
    }
  }

  // Detectar se tem IA
  const hasAI = nodeTypes.some((t: string) => 
    t.includes('openai') || t.includes('agent') || t.includes('chain') || t.includes('vector')
  )

  // Detectar triggers
  const triggers = nodes
    .filter((n: any) => String(n.type || '').toLowerCase().includes('trigger'))
    .map((n: any) => translateNodeType(n.type))

  // Extrair integrações únicas
  const integrations: string[] = [...new Set(nodeTypes.map((t: string) => translateNodeType(t)))]
    .filter((t): t is string => t !== 'Nota Adesiva' && t !== 'Definir Dados')
    .slice(0, 8)

  // Gerar título em português
  let titlePt = generatePortugueseTitle(originalTitle, integrations, category, hasAI)

  // Mapear nodes com tradução
  const mappedNodes = nodes.map((n: any) => {
    const type = String(n.type || '').replace('n8n-nodes-base.', '').replace('@n8n/n8n-nodes-langchain.', '')
    return {
      name: n.name || 'Node',
      namePt: translateNodeName(n.name),
      type: type,
      typePt: translateNodeType(type)
    }
  })

  // Calcular tamanho
  const jsonString = JSON.stringify(jsonData)
  const size = jsonString.length > 1024 
    ? `${(jsonString.length / 1024).toFixed(1)}KB` 
    : `${jsonString.length}B`

  // Gerar descrição mais detalhada
  if (integrations.length > 0) {
    const mainIntegrations = integrations.slice(0, 3).join(', ')
    descriptionPt = `${descriptionPt}. Integra: ${mainIntegrations}${integrations.length > 3 ? ` e mais ${integrations.length - 3}` : ''}.`
  }

  if (hasAI) {
    descriptionPt += ' Utiliza Inteligência Artificial.'
  }

  return {
    titlePt,
    descriptionPt,
    category,
    nodes: mappedNodes,
    integrations,
    nodeCount: nodes.length,
    connectionCount: Object.keys(connections).length,
    size,
    triggers,
    hasAI
  }
}

function translateNodeType(type: string): string {
  const cleanType = type.toLowerCase()
    .replace('n8n-nodes-base.', '')
    .replace('@n8n/n8n-nodes-langchain.', '')
  
  // Buscar tradução exata
  for (const [key, value] of Object.entries(nodeTranslations)) {
    if (cleanType === key.toLowerCase()) {
      return value
    }
  }
  
  // Buscar tradução parcial
  for (const [key, value] of Object.entries(nodeTranslations)) {
    if (cleanType.includes(key.toLowerCase())) {
      return value
    }
  }
  
  // Capitalizar o nome original
  return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1').trim()
}

function translateNodeName(name: string): string {
  // Traduções comuns de nomes de nodes
  const translations: Record<string, string> = {
    'Start': 'Início',
    'End': 'Fim',
    'When clicking': 'Ao Clicar',
    'Edit Fields': 'Editar Campos',
    'Code': 'Código',
    'HTTP Request': 'Requisição HTTP',
    'Webhook': 'Webhook',
    'If': 'Condição',
    'Switch': 'Múltiplas Condições',
    'Merge': 'Mesclar',
    'Split In Batches': 'Dividir em Lotes',
    'No Operation': 'Sem Operação',
  }
  
  return translations[name] || name
}

function generatePortugueseTitle(originalTitle: string, integrations: string[], category: string, hasAI: boolean): string {
  // Traduções comuns de títulos
  const titleTranslations: Record<string, string> = {
    'workflow': 'Fluxo',
    'automation': 'Automação',
    'bot': 'Bot',
    'chatbot': 'Chatbot',
    'alert': 'Alerta',
    'monitor': 'Monitor',
    'sync': 'Sincronização',
    'backup': 'Backup',
    'report': 'Relatório',
    'notification': 'Notificação',
    'scraper': 'Extrator',
    'generator': 'Gerador',
    'assistant': 'Assistente',
    'analyzer': 'Analisador',
    'tracker': 'Rastreador',
    'scheduler': 'Agendador',
    'reminder': 'Lembrete',
    'sender': 'Enviador',
    'receiver': 'Receptor',
    'converter': 'Conversor',
    'validator': 'Validador',
    'checker': 'Verificador',
    'builder': 'Construtor',
    'creator': 'Criador',
    'manager': 'Gerenciador',
    'handler': 'Manipulador',
    'processor': 'Processador',
    'extractor': 'Extrator',
    'importer': 'Importador',
    'exporter': 'Exportador',
    'updater': 'Atualizador',
    'poster': 'Publicador',
    'publisher': 'Publicador',
  }

  let title = originalTitle.toLowerCase()
  
  // Aplicar traduções
  for (const [en, pt] of Object.entries(titleTranslations)) {
    title = title.replace(new RegExp(en, 'gi'), pt)
  }

  // Se não mudou muito, criar título baseado na categoria
  if (title === originalTitle.toLowerCase()) {
    if (hasAI && integrations.length > 0) {
      return `${category} com ${integrations[0]}`
    }
    if (integrations.length >= 2) {
      return `${integrations[0]} para ${integrations[1]}`
    }
    return `${category} - ${originalTitle}`
  }

  // Capitalizar primeira letra de cada palavra
  return title.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}
