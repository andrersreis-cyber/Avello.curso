# Envio em lote para Claude (Anthropic)

**Descrição:**
Automatiza o envio de múltiplos prompts em lote para a API Claude da Anthropic, monitora o processamento até o fim e recupera os resultados processados.

**Ferramentas:**
• Anthropic Claude Batch API: Serviço de modelos de linguagem que recebe batches de mensagens (endpoint messages/batches), fornece status de processamento e disponibiliza resultados via URL.
• LangChain (memória): Biblioteca/estrutura para gerenciar histórico de conversas (buffer de memória) usada para montar mensagens a partir do contexto armazenado.

**Funcionalidades:**
• Receber entradas em lote: Aceita um array de requests e o cabeçalho de versão da API.
• Construir requests a partir de diferentes fontes: Gera objetos de request tanto a partir de uma query simples quanto do histórico de chat (memória).
• Agregar solicitações: Junta múltiplas requests em um único payload de batch.
• Enviar batch para a API Anthropic: Submete o lote para o endpoint de messages/batches com o cabeçalho anthropic-version.
• Polling de status: Faz verificações periódicas até que o processamento do batch esteja com status 'ended'.
• Recuperar resultados: Busca os resultados via results_url fornecido pela API quando o processamento termina.
• Parsear resposta JSONL: Converte respostas separadas por novas linhas (JSONL) em objetos JSON manipuláveis.
• Filtrar e mapear resultados por custom_id: Separa resultados individuais do lote e permite salvar/usar respostas específicas por custom_id.
• Gerenciamento de memória de chat: Insere, carrega e limpa o histórico de chat para compor prompts mais ricos quando necessário.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/10FNLAO0eC3Jhx-d4Xp2m44xai0QxlKh1/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
