# Curadoria automática de projetos GitHub do Hacker News

**Descrição:**
Automatiza a descoberta de links GitHub em posts do Hacker News, extrai informações dos repositórios, gera posts para Twitter e LinkedIn usando IA, armazena registros e notifica o responsável antes da publicação.

**Ferramentas:**
• Hacker News (news.ycombinator.com): Fonte pública para descobrir links e discussões relevantes.
• GitHub: Repositórios-fonte referenciados pelo Hacker News e fonte de conteúdo do projeto.
• OpenAI (modelo GPT-4o-mini): Geração de textos para Twitter e LinkedIn com regras específicas de estilo e formato.
• Airtable: Armazenamento e controle de itens processados, evitando duplicação e registrando status de publicação.
• X (Twitter): Plataforma para publicar posts curtos gerados automaticamente.
• LinkedIn: Plataforma para publicar posts mais longos e orientados a narrativa profissional.
• Telegram: Canal de notificação para alertar o responsável e permitir revisão antes da publicação.

**Funcionalidades:**
• Rastreamento agendado: Periodicamente verifica a página inicial do Hacker News em busca de novos posts.
• Extração de meta: Identifica e filtra links do GitHub e coleta metadados dos posts (título, autor, score, comentários).
• Verificação de duplicatas: Consulta uma base para evitar republicar o mesmo conteúdo.
• Visita ao repositório: Abre a página do GitHub para obter mais contexto e conteúdo do projeto.
• Conversão de conteúdo: Transforma o HTML da página em markdown para facilitar análise.
• Geração de conteúdo com IA: Usa um modelo de linguagem para criar textos formatados para Twitter e LinkedIn com regras específicas (CTA, comprimento, tom).
• Validação de conteúdo: Verifica se os textos gerados atendem ao formato esperado antes de prosseguir.
• Registro em base de dados: Cria/atualiza registros na base (controle de que foi preparado/postado).
• Notificação e espera: Envia a mensagem pronta ao responsável via Telegram e aguarda um intervalo antes da publicação final.
• Publicação em redes: Publica a postagem no X (Twitter) e no LinkedIn e atualiza o status no sistema após o envio.
• Tratamento de erros: Filtra itens com erro para evitar publicações incorretas ou incompletas.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1W1Wr9nS-naXmcflRlmVlw6sEHno-Ms-J/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
