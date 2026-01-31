# 9. Fluxo de busca de palavras chave em grupos de whatsapp.json

**Descrição:**
Fluxo que detecta mensagens, busca palavras-chave, verifica correspondência e envia notificações via API externa quando encontra uma palavra-chave.

**Ferramentas:**
• Baseroow: Base de dados usada para buscar palavras-chave e armazenar dados relacionados no fluxo.
• Evolution API (HTTP): API externa para envio de mensagens de texto via requisições HTTP ao endpoint Evolution.

**Funcionalidades:**
• Detecção de texto e extração de palavras-chave: identifica se a mensagem é texto e obtém as palavras-chave relevantes.
• Busca de palavras-chave no texto: compara a mensagem com a lista de palavras-chave para encontrar correspondência.
• Armazenamento do resultado: guarda a mensagem recebida e a palavra-chave encontrada para uso posterior.
• Integração com Baseroow: consulta a lista de palavras-chave a partir da base de dados Baseroow.
• Envio de notificação via API externa: envia a mensagem com a palavra-chave encontrada para o destinatário através de uma API externa.

**Link Download/Acesso:** [Acessar](https://drive.google.com/file/d/119jIIPO-PBqo3sGcDODczS3-UBUuZr4n/view?usp=drivesdk)

## Fluxo JSON
O arquivo JSON do fluxo foi salvo nesta pasta como `fluxo.json`.
