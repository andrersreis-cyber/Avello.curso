# 8. Fluxo de resumo de grupo.json

**Descrição:**
Este fluxo coleta mensagens de grupos do WhatsApp, filtra os grupos desejados, agrega as mensagens e gera um resumo estruturado com IA. Também armazena informações em base de dados e envia o resumo final por meio de uma API externa, com gatilhos via Webhook e agendamento para automação.

**Ferramentas:**
• Baseroow: Base de dados usada para armazenar informações de grupos e mensagens.
• OpenAI: Serviço de linguagem utilizado para gerar o resumo detalhado.
• Flux Automate API: Serviço externo utilizado para buscar grupos, gerenciar mensagens e enviar o resumo ao WhatsApp.

**Funcionalidades:**
• Coleta e filtragem de mensagens dos grupos: Busca as mensagens dos grupos escolhidos e aplica filtros.
• Agrupamento e preparação de dados: Agrupa mensagens para preparação do resumo.
• Geração do resumo com IA: Envia o conteúdo para o modelo de linguagem gerar um resumo estruturado.
• Persistência de dados: Armazena informações de grupos e mensagens em uma base de dados, com limpeza de mensagens antigas conforme o fluxo.
• Envio do resumo via API externa: Envia o resumo final para o WhatsApp usando a API do Flux Automate.
• Gatilhos e automação: Inicia a automação via Webhook e agendamentos programados.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1l0KWzPaVaDjHw_yVOPeE7Th8owbgw_4H/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
