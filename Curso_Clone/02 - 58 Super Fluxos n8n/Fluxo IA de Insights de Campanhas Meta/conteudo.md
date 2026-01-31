# Fluxo IA de Insights de Campanhas Meta

**Descrição:**
Fluxo que lê dados da planilha para api_meta e id_conta, consulta o Facebook Insights para campanhas e usa IA para definir o intervalo temporal adequado antes de gerar insights a partir dos dados.

**Ferramentas:**
• Google Sheets: Fonte de dados para api_meta e id_conta a partir da planilha
• Facebook Graph API Insights: Coleta métricas de campanhas (impressions, clicks, spend, etc.) via endpoint insights com access_token
• OpenAI API: Geração de insights e análises com o modelo de linguagem

**Funcionalidades:**
• Leitura de dados da planilha Google Sheets para api_meta e id_conta
• Consulta ao Facebook Graph API Insights para campanhas com campos de métricas e token de acesso
• Definição do intervalo temporal com IA com base no pedido
• Geração de insights por meio de modelo de linguagem
• Acionamento da automação por mensagens de chat

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1r_CIeOhZyYRwwNNlQHKN4NriiHwdngv4/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
