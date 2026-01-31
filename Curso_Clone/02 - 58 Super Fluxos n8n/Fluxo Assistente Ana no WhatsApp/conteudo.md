# Fluxo Assistente Ana no WhatsApp

**Descrição:**
Fluxo que recebe mensagens via WhatsApp, processa áudio, imagem e texto, utiliza IA para transcrição, explicação de imagens, resumo e geração de mensagens, mantém memória de conversas e coordena tarefas como leitura/criação de eventos no calendário, envio de e-mails e consultas na web, respondendo ao usuário com o Assistente Ana.

**Ferramentas:**
• WhatsApp API: plataforma de mensagens para envio e recebimento de mensagens.
• OpenAI API: serviços de linguagem para transcrição, explicação de imagens, sumarização e geração de respostas.
• Google Calendar API: gerenciamento de eventos do calendário.
• Gmail API: ler, compor e enviar e-mails.
• SerpAPI: buscas na web com resumos de resultados.
• Supabase: armazenamento de vetores e dados para memória e consultas semânticas.
• PostgreSQL: banco de dados para memória de chat.

**Funcionalidades:**
• Detecção e roteamento de mensagens: identifica o tipo de conteúdo (áudio, imagem, vídeo, texto) e encaminha para as etapas correspondentes.
• Transcrição de áudio: transcreve arquivos de áudio para texto usando IA.
• Explicação de imagem: descreve imagens enviadas e extrai texto visível.
• Resumo de mensagens: gera resumos de textos recebidos.
• Memória de conversa: armazena o histórico de chat em Postgres para contexto.
• Busca semântica e recuperação de informações: usa um vetor store (Supabase) e embeddings para localizar contatos, templates e conteúdos relevantes.
• Gerenciamento de calendário: lê e cria eventos no Google Calendar.
• Envio/aprovação de emails com templates: consulta templates na vector store e envia emails via Gmail.
• Resposta ao usuário via WhatsApp: envia mensagens com conteúdo gerado pelo fluxo.
• Roteamento por tipo de conteúdo: utiliza um switch para tratar áudio, vídeo, imagem e texto.
• Integração com modelos de linguagem: utiliza modelos OpenAI para geração de respostas e conteúdos.
• Armazenamento de memória de chat por sessão: utiliza chave de sessão personalizada para manter contexto.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1HYgBqqqplQau0hJG21uCNBUuwPkbroBK/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
