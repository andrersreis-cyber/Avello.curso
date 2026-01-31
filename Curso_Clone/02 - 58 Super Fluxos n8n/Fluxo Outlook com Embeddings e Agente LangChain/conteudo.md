# Fluxo Outlook com Embeddings e Agente LangChain

**Descrição:**
Este fluxo lê mensagens do Outlook, cria embeddings, armazena em vetores em Postgres PGVector e Pinecone, e usa um agente de linguagem para responder perguntas com base no conteúdo indexado, acionando pela mensagem recebida via chat.

**Ferramentas:**
• Microsoft Outlook: Serviço de leitura de emails externo utilizado para extrair mensagens.
• OpenAI: Fornece embeddings de texto e modelos de linguagem usados no fluxo.
• Pinecone: Serviço de vetor para armazenar embeddings e realizar buscas semânticas.
• PostgreSQL PGVector: Banco de dados relacional com suporte a vetores para armazenamento de embeddings.

**Funcionalidades:**
• Inicia a automação ao acionar o workflow manualmente.
• Busca emails no Outlook recebidos após uma data específica.
• Constrói payload com metadados do email (Data recebida, Remetente, Assunto, ID da mensagem, Corpo).
• Gera embeddings com OpenAI e armazena nos vetores do Postgres PGVector e do Pinecone.
• Processa conteúdo com modelos de linguagem via um agente LangChain para responder a perguntas com base no conteúdo indexado.
• Habilita chat com gatilho para receber mensagens e consultar a memória de chat.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/17OPQuVM1gkH03idD02BMHJmWAlJvPFuo/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
