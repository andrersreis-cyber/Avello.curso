# Fluxo de Transcrição e Resumo de Vídeos YouTube com Apify

**Descrição:**
Este fluxo usa a API Apify para extrair transcrições de vídeos do YouTube, inicia uma execução de ator para processar o vídeo, gera resumos com um modelo de linguagem, divide a transcrição em seções com timestamps e prepara os dados de saída para armazenamento e uso posterior.

**Ferramentas:**
• Apify: Serviço de automação usado para extrair transcrição de vídeos via ator e dataset
• OpenAI Chat Model: Modelo de linguagem utilizado para gerar o resumo do vídeo e analisar a transcrição

**Funcionalidades:**
• Integração com Apify: busca a execução do ator e os dados do dataset para o vídeo
• Definição de entrada: recebe a URL do vídeo para processar
• Início de ator: inicia a execução do ator Apify com a URL do vídeo
• Extração de transcrição: obtém a transcrição a partir do dataset
• Resumo do vídeo: gera um resumo do conteúdo do vídeo
• Timestamps e resumo da transcrição: divide a transcrição em seções com timestamps e produz um resumo por trecho
• Preparação de saída: consolida id, resumo de vídeo, resumo da transcrição e a transcrição completa
• Preparação de input para banco de dados: estrutura os dados para atualização em Airtable ou similar
• Teste rápido: permite testar o fluxo via trigger manual

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/1Dfw6v2Rt6ItCHeOh6OgD4iYsqHXiqEno/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
