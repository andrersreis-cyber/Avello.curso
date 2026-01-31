# Fluxo de Relatórios de Mercado - Imóveis Vendidos em San Francisco

**Descrição:**
Este fluxo coleta dados de imóveis vendidos, extrai informações-chave, registra tudo em uma planilha e gera relatórios de mercado com resumos enviados por e-mail e Slack.

**Ferramentas:**
• Jina Proxy (r.jina.ai): proxy para buscar conteúdo de páginas web, usado para obter dados do Zillow.
• Zillow: fonte de imóveis vendidos analisados.
• Google Sheets: planilha onde os dados extraídos são armazenados.
• SerpAPI: API de busca para enriquecimento de dados de mercado.
• Gmail: serviço de envio de e-mails.
• Slack: canal de mensagens no Slack para compartilhar insights.
• OpenAI / LangChain (GPT-4o-mini): modelos de linguagem usados para extração de dados, análise de mercado e geração de relatórios (Information Extractor, Real Estate AI Agent, Gmail Summary, Slack Summary).

**Funcionalidades:**
• Gatilho manual: inicia a automação ao clicar em Test workflow.
• Busca de dados imobiliários: obtém imóveis vendidos de San Francisco através de um proxy da web.
• Extração de dados: usa IA para extrair detalhes por propriedade (endereço, preço, quartos, banheiros, tamanho, data de venda, URL, corretor, tipo e preço por pé quadrado).
• Armazenamento de dados: grava os resultados em uma planilha Google Sheets com mapeamento de campos.
• Análise de mercado com IA: analisa o conjunto de dados e gera insights sobre tendências, oportunidades e timing de mercado.
• Geração de sumários: cria conteúdos de e-mail e resumos para Slack com os principais insights.
• Envio de resultados: envia o sumário por Gmail e posta o resumo no Slack.
• Integração com fontes externas: utiliza ferramentas adicionais (como SerpAPI) para enriquecimento de dados quando necessário.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/15RFOtyiF9N0jFa281R3OAeAOT1wyvL8l/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
