# Salvar ideias do Slack no Notion

**Descrição:**
Recebe comandos slash do Slack e cria páginas em um banco de dados do Notion, notificando o autor para adicionar mais detalhes.

**Ferramentas:**
• Slack: Plataforma que envia o comando slash (/idea), fornece dados do usuário e disponibiliza um response_url para respostas.
• Notion: Banco de dados onde são criadas páginas com as ideias, armazenando título e informação do criador.

**Funcionalidades:**
• Receber comando slash do Slack: Aceita POST do comando /idea e extrai texto, usuário e response_url.
• Roteamento por comando: Identifica o comando recebido e permite suportar diferentes comandos (ex.: /idea, /bug) via regras.
• Criar página no Notion: Insere uma nova página no database usando o texto do comando como título e registra o criador no campo Creator.
• Enviar mensagem de confirmação para Slack: Publica uma resposta ao usuário via response_url, menciona o autor e fornece um link para adicionar detalhes e hipóteses.
• Configuração centralizada: Usa um campo configurável com a URL do database do Notion para facilitar o setup e reuso.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1bR-XZ8l6qE8KgeTR0S2eWjy-nzh75xGY/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
