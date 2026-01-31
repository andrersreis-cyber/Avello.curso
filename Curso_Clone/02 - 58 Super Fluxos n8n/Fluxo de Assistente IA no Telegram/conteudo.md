# Fluxo de Assistente IA no Telegram

**Descrição:**
Fluxo que atua como um agente de IA para responder mensagens pelo Telegram, executando ações como envio de e-mails, verificação de e-mails não lidos, gerenciamento de tarefas e reuniões, criação de eventos no calendário e chamadas, utilizando ferramentas externas integradas.

**Ferramentas:**
• Telegram: Plataforma de mensagens para receber perguntas do usuário e enviar respostas.
• OpenAI: Serviço de IA utilizado para transcrição de áudio e processamento de linguagem.
• Pinecone Vector Store: Serviço de busca por vetores para dados de contatos e semântica.
• Embeddings OpenAI: Geração de embeddings de texto para consultas semânticas.
• Calendar (integração de agenda): Consulta de reuniões do dia e criação de novos eventos.
• Email: Serviço de envio de emails e recuperação de mensagens.
• To-do / Tarefas: Serviço de gerenciamento de tarefas (listar hoje, adicionar novas).
• Phone call: Serviço de chamadas telefônicas para realizar ligações.

**Funcionalidades:**
• Detecção de mensagens via Telegram Trigger: inicia a automação assim que chega uma mensagem do usuário.
• Manutenção de contexto entre mensagens: utiliza a Window Buffer Memory para conservar o estado da conversa.
• Interpretação de comandos pela IA e acionamento de ferramentas: identifica a ação solicitada (email, emails não lidos, tarefa, reunião, etc.) e invoca a ferramenta correspondente.
• Envio de e-mails: utiliza a ferramenta de envio de e-mail para mandar mensagens com destinatário, assunto e conteúdo.
• Recuperação de e-mails não lidos: consulta a caixa para exibir mensagens não lidas.
• Gerenciamento de reuniões: consulta as reuniões de hoje e pode criar novos eventos no calendário.
• Criação de eventos de calendário: agenda novos compromissos com start, end, participantes, descrição e resumo.
• Gerenciamento de tarefas: listar tarefas de hoje e adicionar novas tarefas.
• Acesso a dados de contatos: consulta informações de contato a partir do banco de dados/vetor.
• Busca semântica com embeddings: usa embeddings da OpenAI e Pinecone para melhorar a correspondência de contatos.
• Transcrição de áudio: converte mensagens de voz em texto para processamento.
• Envio de respostas pelo Telegram: retorna as informações ou confirmações ao usuário via chat.
• Execução de chamadas telefônicas: realiza ligações quando solicitado.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1d9TcTPV9hHIbNv3kh9Ym8xQhPftqzAJm/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
